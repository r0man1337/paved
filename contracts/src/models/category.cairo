// Core imports

use debug::PrintTrait;

// Constants

const NONE: felt252 = 0;
const FARM: felt252 = 'FARM';
const ROAD: felt252 = 'ROAD';
const CITY: felt252 = 'CITY';
const STOP: felt252 = 'STOP';
const WONDER: felt252 = 'WNDR';

const FARM_KEY: felt252 = 'F';
const ROAD_KEY: felt252 = 'R';
const CITY_KEY: felt252 = 'C';
const STOP_KEY: felt252 = 'S';
const WONDER_KEY: felt252 = 'W';

#[derive(Copy, Drop, Serde, PartialEq, Introspection)]
enum Category {
    None,
    Farm,
    Road,
    City,
    Stop,
    Wonder,
}

impl CategoryIntoFelt252 of Into<Category, felt252> {
    #[inline(always)]
    fn into(self: Category) -> felt252 {
        match self {
            Category::None => NONE,
            Category::Farm => FARM,
            Category::Road => ROAD,
            Category::City => CITY,
            Category::Stop => STOP,
            Category::Wonder => WONDER,
        }
    }
}

impl CategoryIntoU8 of Into<Category, u8> {
    #[inline(always)]
    fn into(self: Category) -> u8 {
        match self {
            Category::None => 0,
            Category::Farm => 1,
            Category::Road => 2,
            Category::City => 3,
            Category::Stop => 4,
            Category::Wonder => 5,
        }
    }
}

impl Felt252IntoCategory of Into<felt252, Category> {
    #[inline(always)]
    fn into(self: felt252) -> Category {
        if self == FARM || self == FARM_KEY {
            Category::Farm
        } else if self == ROAD || self == ROAD_KEY {
            Category::Road
        } else if self == CITY || self == CITY_KEY {
            Category::City
        } else if self == STOP || self == STOP_KEY {
            Category::Stop
        } else if self == WONDER || self == WONDER_KEY {
            Category::Wonder
        } else {
            Category::None
        }
    }
}

impl U8IntoCategory of Into<u8, Category> {
    #[inline(always)]
    fn into(self: u8) -> Category {
        if self == 1 {
            Category::Farm
        } else if self == 2 {
            Category::Road
        } else if self == 3 {
            Category::City
        } else if self == 4 {
            Category::Stop
        } else if self == 5 {
            Category::Wonder
        } else {
            Category::None
        }
    }
}

impl CategoryPrint of PrintTrait<Category> {
    #[inline(always)]
    fn print(self: Category) {
        let felt: felt252 = self.into();
        felt.print();
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{
        Category, NONE, FARM, ROAD, CITY, STOP, WONDER, FARM_KEY, ROAD_KEY, CITY_KEY, STOP_KEY,
        WONDER_KEY
    };

    // Constants

    const UNKNOWN_FELT: felt252 = 'UNKNOWN';
    const UNKNOWN_U8: u8 = 42;

    #[test]
    fn test_category_into_felt() {
        assert(NONE == Category::None.into(), 'Category: wrong None');
        assert(FARM == Category::Farm.into(), 'Category: wrong Farm');
        assert(ROAD == Category::Road.into(), 'Category: wrong Road');
        assert(CITY == Category::City.into(), 'Category: wrong City');
        assert(STOP == Category::Stop.into(), 'Category: wrong Stop');
        assert(WONDER == Category::Wonder.into(), 'Category: wrong Wonder');
    }

    #[test]
    fn test_felt_into_category() {
        assert(Category::None == NONE.into(), 'Category: wrong None');
        assert(Category::Farm == FARM.into(), 'Category: wrong Farm');
        assert(Category::Road == ROAD.into(), 'Category: wrong Road');
        assert(Category::City == CITY.into(), 'Category: wrong City');
        assert(Category::Stop == STOP.into(), 'Category: wrong Stop');
        assert(Category::Wonder == WONDER.into(), 'Category: wrong Wonder');
        assert(Category::Farm == FARM_KEY.into(), 'Category: wrong Farm');
        assert(Category::Road == ROAD_KEY.into(), 'Category: wrong Road');
        assert(Category::City == CITY_KEY.into(), 'Category: wrong City');
        assert(Category::Stop == STOP_KEY.into(), 'Category: wrong Stop');
        assert(Category::Wonder == WONDER_KEY.into(), 'Category: wrong Wonder');
    }

    #[test]
    fn test_unknown_felt_into_category() {
        assert(Category::None == 'X'.into(), 'Category: wrong None');
    }

    #[test]
    fn test_category_into_u8() {
        assert(0_u8 == Category::None.into(), 'Category: wrong None');
        assert(1_u8 == Category::Farm.into(), 'Category: wrong Farm');
        assert(2_u8 == Category::Road.into(), 'Category: wrong Road');
        assert(3_u8 == Category::City.into(), 'Category: wrong City');
        assert(4_u8 == Category::Stop.into(), 'Category: wrong Stop');
        assert(5_u8 == Category::Wonder.into(), 'Category: wrong Wonder');
    }

    #[test]
    fn test_u8_into_category() {
        assert(Category::None == 0_u8.into(), 'Category: wrong None');
        assert(Category::Farm == 1_u8.into(), 'Category: wrong Farm');
        assert(Category::Road == 2_u8.into(), 'Category: wrong Road');
        assert(Category::City == 3_u8.into(), 'Category: wrong City');
        assert(Category::Stop == 4_u8.into(), 'Category: wrong Stop');
        assert(Category::Wonder == 5_u8.into(), 'Category: wrong Wonder');
    }

    #[test]
    fn test_unknown_u8_into_category() {
        assert(Category::None == UNKNOWN_U8.into(), 'Category: wrong None');
    }
}
