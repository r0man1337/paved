// Core imports

use core::debug::PrintTrait;

// Internal imports

use paved::layouts::interface::LayoutTrait;
use paved::types::direction::Direction;
use paved::types::spot::{Spot, SpotImpl};
use paved::types::move::{Move, MoveImpl};
use paved::types::area::Area;

impl LayoutImpl of LayoutTrait {
    #[inline(always)]
    fn starts() -> Array<Spot> {
        let mut starts: Array<Spot> = ArrayTrait::new();
        starts.append(Spot::Center);
        starts.append(Spot::North);
        starts.append(Spot::South);
        starts
    }

    #[inline(always)]
    fn moves(from: Spot) -> Array<Move> {
        let area: Area = LayoutImpl::area(from);
        let mut moves: Array<Move> = ArrayTrait::new();
        match area {
            Area::A => { moves.append(Move { direction: Direction::East, spot: Spot::West }); },
            Area::B => { moves.append(Move { direction: Direction::North, spot: Spot::South }); },
            Area::C => {
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            _ => {},
        };
        moves
    }

    #[inline(always)]
    fn area(from: Spot) -> Area {
        match from {
            Spot::None => Area::None,
            Spot::Center => Area::A,
            Spot::NorthWest => Area::A,
            Spot::North => Area::B,
            Spot::NorthEast => Area::A,
            Spot::East => Area::A,
            Spot::SouthEast => Area::A,
            Spot::South => Area::C,
            Spot::SouthWest => Area::C,
            Spot::West => Area::C,
        }
    }

    #[inline(always)]
    fn adjacent_roads(from: Spot) -> Array<Spot> {
        let mut roads: Array<Spot> = ArrayTrait::new();
        match from {
            Spot::None => {},
            Spot::Center => {},
            Spot::NorthWest => {},
            Spot::North => {},
            Spot::NorthEast => {},
            Spot::East => {},
            Spot::SouthEast => {},
            Spot::South => {},
            Spot::SouthWest => {},
            Spot::West => {},
        };
        roads
    }

    #[inline(always)]
    fn adjacent_cities(from: Spot) -> Array<Spot> {
        let mut cities: Array<Spot> = ArrayTrait::new();
        match from {
            Spot::None => {},
            Spot::Center => {
                cities.append(Spot::North);
                cities.append(Spot::South);
            },
            Spot::NorthWest => {
                cities.append(Spot::North);
                cities.append(Spot::South);
            },
            Spot::North => {},
            Spot::NorthEast => {
                cities.append(Spot::North);
                cities.append(Spot::South);
            },
            Spot::East => {
                cities.append(Spot::North);
                cities.append(Spot::South);
            },
            Spot::SouthEast => {
                cities.append(Spot::North);
                cities.append(Spot::South);
            },
            Spot::South => {},
            Spot::SouthWest => {},
            Spot::West => {},
        };
        cities
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{LayoutImpl, Direction, Spot, Move};

    #[test]
    fn test_layouts_moves_from_north() {
        let mut moves = LayoutImpl::moves(Spot::North);
        assert(moves.len() == 1, 'Layout: wrong moves len');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::North, spot: Spot::South };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');
    }
}
