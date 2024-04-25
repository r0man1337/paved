// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::{set_contract_address, set_transaction_hash};

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use paved::constants;
use paved::store::{Store, StoreTrait};
use paved::models::game::{Game, GameTrait};
use paved::models::builder::{Builder, BuilderTrait};
use paved::models::tile::{Tile, TileTrait, CENTER};
use paved::types::mode::Mode;
use paved::types::order::Order;
use paved::types::orientation::Orientation;
use paved::types::direction::Direction;
use paved::types::plan::Plan;
use paved::types::role::Role;
use paved::types::spot::Spot;
use paved::systems::host::IHostDispatcherTrait;
use paved::systems::play::IPlayDispatcherTrait;
use paved::tests::setup::{setup, setup::{Systems, PLAYER, ANYONE}};

//   [ plan='RFFFRFCFR', south, x=0, y=0 ],
//   [ plan='RFRFCCCFR', west, x=1, y=0 ],
//   [ plan='RFRFCCCFR', east, x=1, y=1 ],
//   [ plan='RFFFRFFFR', north, x=-1, y=0 ],
//   [ plan='CCCCCFRFC', east, x=2, y=1 ],
//   [ plan='RFFFRFCFR', west, x=1, y=2 ],
//   [ plan='RFRFFFFFR', west, x=1, y=3 ],
//   [ plan='RFRFCCCFR', south, x=2, y=0 ],
//   [ plan='RFRFFFFFR', north, x=2, y=-1 ],
//   [ plan='CCCCCFFFC', west, x=0, y=2 ],
//   [ plan='SFRFRFFFR', north, x=1, y=-1 ],
//   [ plan='RFRFCCCFR', east, x=0, y=3 ],
//   [ plan='FFCFFFCFF', west, x=-1, y=1 ],
//   [ plan='RFFFRFFFR', north, x=-2, y=0 ],
//   [ plan='FFFFFFCFF', west, x=-2, y=1 ],
//   [ plan='RFFFRFFFR', north, x=-3, y=0 ],
//   [ plan='RFRFFFFFR', east, x=-4, y=0 ],
//   [ plan='RFRFFFCFR', north, x=3, y=0 ],
//   [ plan='SFRFRFFFR', east, x=-4, y=1 ],
//   [ plan='WFFFFFFFF', north, x=-2, y=2 ],
//   [ plan='RFFFRFCFR', east, x=-4, y=2 ],
//   [ plan='CCCCCFRFC', north, x=3, y=1 ],
//   [ plan='RFFFRFFFR', east, x=-4, y=3 ],
//   [ plan='RFFFRFFFR', east, x=-4, y=4 ],
//   [ plan='SFRFRFCFR', east, x=0, y=4 ],
//   [ plan='CCCCCFFFC', east, x=-1, y=3 ],
//   [ plan='WFFFFFFFF', north, x=-3, y=3 ],
//   [ plan='CCCCCFFFC', south, x=-1, y=4 ],
//   [ plan='CCCCCFFFC', north, x=-2, y=4 ],
//   [ plan='FFFFFFCFF', west, x=-3, y=4 ],
//   [ plan='SFRFRFCFR', north, x=-2, y=5 ],
//   [ plan='RFRFFFCFR', south, x=-4, y=5 ],
//   [ plan='SFRFRFRFR', north, x=0, y=5 ],
//   [ plan='WFFFFFFFF', north, x=-2, y=3 ],
//   [ plan='CCCCCCCCC', north, x=0, y=1 ],
//   [ plan='RFFFRFCFR', south, x=-3, y=5 ],
//   [ plan='SFRFRFFFR', north, x=-1, y=5 ],
//   [ plan='FFFFCCCFF', west, x=-1, y=2 ],
//   [ plan='WFFFFFFFR', north, x=-3, y=1 ],
//   [ plan='WFFFFFFFF', north, x=-3, y=2 ],

#[test]
fn test_case_014() {
    // [Setup]
    let (world, systems, context) = setup::spawn_game(Mode::Multi);
    let store = StoreTrait::new(world);

    // [Start]
    systems.host.ready(world, context.game_id, true);
    systems.host.start(world, context.game_id);

    // [Draw & Build]
    let mut game = store.game(context.game_id);
    game.seed = setup::compute_seed(store.game(game.id), Plan::RFRFFFFFR);
    store.set_game(game);
    systems.play.draw(world, game.id);
    let orientation = Orientation::North;
    let x = CENTER + 2;
    let y = CENTER - 1;
    systems.play.build(world, context.game_id, orientation, x, y, Role::None, Spot::None);

    // [Draw & Build]
    let mut game = store.game(context.game_id);
    game.seed = setup::compute_seed(store.game(game.id), Plan::WFFFFFFFF);
    store.set_game(game);
    systems.play.draw(world, game.id);
    let orientation = Orientation::North;
    let x = CENTER - 2;
    let y = CENTER + 2;
    systems.play.build(world, context.game_id, orientation, x, y, Role::Adventurer, Spot::Center);

    // [Draw & Build]
    let mut game = store.game(context.game_id);
    game.seed = setup::compute_seed(store.game(game.id), Plan::WFFFFFFFR);
    store.set_game(game);
    systems.play.draw(world, game.id);
    let orientation = Orientation::North;
    let x = CENTER - 3;
    let y = CENTER + 1;
    systems.play.build(world, context.game_id, orientation, x, y, Role::Lady, Spot::Center);

    // [Assert]
    let builder = store.builder(game, context.player_id);
    assert(builder.score == 0, 'Build: builder score');

    // [Draw & Build]
    let mut game = store.game(context.game_id);
    game.seed = setup::compute_seed(store.game(game.id), Plan::WFFFFFFFF);
    store.set_game(game);
    systems.play.draw(world, game.id);
    let orientation = Orientation::North;
    let x = CENTER - 3;
    let y = CENTER + 2;
    systems.play.build(world, context.game_id, orientation, x, y, Role::Algrim, Spot::Center);

    // [Assert]
    let builder = store.builder(game, context.player_id);
    builder.score.print();
    assert(builder.score == 3600, 'Build: builder score');
}
