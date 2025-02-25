// Core imports

use core::debug::PrintTrait;

// Internal imports

use paved::constants;
use paved::store::{Store, StoreImpl};
use paved::events::{ScoredCity, ScoredRoad};
use paved::types::spot::Spot;
use paved::types::area::Area;
use paved::types::move::{Move, MoveImpl};
use paved::types::category::Category;
use paved::models::game::{Game, GameImpl};
use paved::models::builder::{Builder, BuilderImpl};
use paved::models::character::{Character, CharacterPosition};
use paved::models::tile::{Tile, TilePosition, ZeroableTilePosition, TileImpl};
use paved::helpers::multiplier::compute_multiplier;

#[generate_trait]
impl GenericCount of GenericCountTrait {
    #[inline(always)]
    fn start(game: Game, tile: Tile, at: Spot, ref store: Store) -> (u32, Array<Character>) {
        // [Compute] Setup recursion
        let mut characters: Array<Character> = ArrayTrait::new();
        let mut visited: Felt252Dict<bool> = core::Default::default();
        // [Compute] Recursively count the points
        let mut count = 0;
        GenericCount::iter(game, tile, at, ref count, ref visited, ref characters, ref store);
        (count, characters)
    }

    fn iter(
        game: Game,
        tile: Tile,
        at: Spot,
        ref count: u32,
        ref visited: Felt252Dict<bool>,
        ref characters: Array<Character>,
        ref store: Store
    ) {
        // [Check] The tile area is already visited, then pass
        let area: Area = tile.area(at);
        let visited_key = tile.get_key(area);
        if visited.get(visited_key) {
            return;
        };
        visited.insert(visited_key, true);
        count += 1;

        // [Check] The tile handles a character
        let spot: Spot = tile.occupied_spot.into();
        if 0 != spot.into() && tile.are_connected(at, spot) {
            let character_position: CharacterPosition = store
                .character_position(game, tile, spot.into());
            let character = store
                .character(game, character_position.player_id, character_position.index.into());
            characters.append(character);
        };

        // [Compute] Process next tiles if exist
        let mut north_oriented_moves: Array<Move> = tile.north_oriented_moves(at);
        loop {
            match north_oriented_moves.pop_front() {
                // [Compute] Process the current move
                Option::Some(north_oriented_move) => {
                    let mut move = north_oriented_move.rotate(tile.orientation.into());

                    // [Check] A tile exists at this position, otherwise the structure is not finished
                    let (x, y) = tile.proxy_coordinates(move.direction);
                    let tile_position: TilePosition = store.tile_position(game, x, y);
                    if tile_position.is_zero() {
                        count = 0;
                        break;
                    }

                    // [Check] If the points are zero, the structure is not finished
                    let neighbor = store.tile(game, tile_position.tile_id);
                    GenericCount::iter(
                        game, neighbor, move.spot, ref count, ref visited, ref characters, ref store
                    );
                    if 0 == count.into() {
                        break;
                    };
                },
                // [Check] Otherwise returns the points
                Option::None => { break; },
            }
        }
    }

    fn solve(
        ref game: Game,
        category: Category,
        count: u32,
        base_points: u32,
        ref characters: Array<Character>,
        ref scored_cities: Array<ScoredCity>,
        ref scored_roads: Array<ScoredRoad>,
        ref store: Store
    ) {
        // [Compute] Find the winner
        let mut winner_weight: u32 = 0;
        let mut winner: felt252 = 0;
        let mut solved: bool = false;
        let mut counter: Felt252Dict<u32> = core::Default::default();
        let mut powers: Felt252Dict<u32> = core::Default::default();
        loop {
            match characters.pop_front() {
                Option::Some(mut character) => {
                    // [Compute] Update builder counter
                    let weight: u32 = character.weight.into();
                    let builder_weight = counter.get(character.player_id) + weight;
                    counter.insert(character.player_id, builder_weight);

                    // [Compute] Update builder power
                    let power: u32 = character.power.into();
                    let builder_power = powers.get(character.player_id);
                    if power > builder_power {
                        powers.insert(character.player_id, power);
                    };

                    // [Effect] Collect the character's builder
                    let mut tile = store.tile(game, character.tile_id);
                    let mut builder = store.builder(game, character.player_id);
                    builder.recover(ref character, ref tile);

                    // [Effect] Update the character
                    store.set_character(character);

                    // [Effect] Update the tile
                    store.set_tile(tile);

                    // [Effect] Update the builder
                    store.set_builder(builder);

                    // [Compute] Update winner if needed
                    if builder_weight > winner_weight {
                        winner = builder.player_id;
                        winner_weight = builder_weight;
                        solved = true;
                    } else if builder_weight == winner_weight {
                        solved = false;
                    };
                },
                Option::None => { break; },
            };
        };

        if solved {
            // [Compute] Update the scores if a winner is determined
            let mut player = store.player(winner);
            let mut builder = store.builder(game, player.id);
            let power = powers.get(winner);
            let (num, den) = compute_multiplier(count);
            let points = count * base_points * power * num / den;

            // [Build] Events
            if category == Category::City {
                let event = ScoredCity {
                    game_id: game.id,
                    points: points,
                    size: count,
                    player_id: player.id,
                    player_name: player.name,
                    player_master: player.master,
                    player_order_id: player.order,
                };
                scored_cities.append(event);
            };
            if category == Category::Road {
                let event = ScoredRoad {
                    game_id: game.id,
                    points: points,
                    size: count,
                    player_id: player.id,
                    player_name: player.name,
                    player_master: player.master,
                    player_order_id: player.order,
                };
                scored_roads.append(event);
            };

            game.add_score(ref builder, ref player, points);

            // [Effect] Update the builder
            store.set_builder(builder);

            // [Effect] Update the player
            store.set_player(player);
        };
    }
}
