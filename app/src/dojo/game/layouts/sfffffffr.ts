// Source: https://github.com/stolslilabs/paved/blob/main/contracts/src/layouts/sfffffffr.cairo

import { AreaType } from "../types/area";
import { Move } from "../types/move";
import { Direction, DirectionType } from "../types/direction";
import { Spot, SpotType } from "../types/spot";

export class Configuration {
  public static starts(): Array<SpotType> {
    return [SpotType.East, SpotType.West];
  }

  public static moves(from: SpotType): Array<Move> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.North:
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.South),
          ),
          new Move(new Direction(DirectionType.East), new Spot(SpotType.West)),
          new Move(
            new Direction(DirectionType.South),
            new Spot(SpotType.North),
          ),
          new Move(
            new Direction(DirectionType.West),
            new Spot(SpotType.NorthEast),
          ),
          new Move(
            new Direction(DirectionType.West),
            new Spot(SpotType.SouthEast),
          ),
        ];
      case SpotType.West:
        return [
          new Move(new Direction(DirectionType.West), new Spot(SpotType.East)),
        ];
      default:
        return [];
    }
  }

  public static area(from: SpotType): AreaType {
    switch (from) {
      case SpotType.Center:
        return AreaType.A;
      case SpotType.NorthWest:
      case SpotType.North:
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return AreaType.B;
      case SpotType.West:
        return AreaType.C;
      default:
        return AreaType.None;
    }
  }

  public static adjacentRoads(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.North:
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.South:
      case SpotType.SouthWest:
        return [SpotType.West];
      default:
        return [];
    }
  }

  public static adjacentCities(_from: SpotType): Array<SpotType> {
    return [];
  }
}
