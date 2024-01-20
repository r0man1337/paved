// Core imports

use debug::PrintTrait;

// Internal imports

use stolsli::layouts::interface::LayoutTrait;
use stolsli::types::direction::Direction;
use stolsli::types::spot::{Spot, SpotImpl};
use stolsli::types::move::{Move, MoveImpl};

impl LayoutImpl of LayoutTrait {
    #[inline(always)]
    fn moves(from: Spot) -> Array<Move> {
        let mut moves: Array<Move> = ArrayTrait::new();
        match from {
            Spot::None => {},
            Spot::Center => {
                moves.append(Move { direction: Direction::NorthWest, spot: Spot::None });
                moves.append(Move { direction: Direction::North, spot: Spot::None });
                moves.append(Move { direction: Direction::NorthEast, spot: Spot::None });
                moves.append(Move { direction: Direction::East, spot: Spot::None });
                moves.append(Move { direction: Direction::SouthEast, spot: Spot::None });
                moves.append(Move { direction: Direction::South, spot: Spot::None });
                moves.append(Move { direction: Direction::SouthWest, spot: Spot::None });
                moves.append(Move { direction: Direction::West, spot: Spot::None });
            },
            Spot::NorthWest => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::North => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::NorthEast => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::East => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::SouthEast => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::South => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::SouthWest => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
            Spot::West => {
                moves.append(Move { direction: Direction::North, spot: Spot::South });
                moves.append(Move { direction: Direction::East, spot: Spot::West });
                moves.append(Move { direction: Direction::South, spot: Spot::North });
                moves.append(Move { direction: Direction::West, spot: Spot::East });
            },
        };
        moves
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{LayoutImpl, Direction, Spot, Move};

    #[test]
    fn test_layouts_moves_from_north() {
        let mut moves = LayoutImpl::moves(Spot::North);
        assert(moves.len() == 4, 'Layout: wrong moves len');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::North, spot: Spot::South };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::East, spot: Spot::West };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::South, spot: Spot::North };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');

        let move = moves.pop_front().unwrap();
        let expected = Move { direction: Direction::West, spot: Spot::East };
        assert(move.direction == expected.direction, 'Layout: wrong move direction');
        assert(move.spot == expected.spot, 'Layout: wrong move spot');
    }
}
