// Source: https://github.com/stolslilabs/paved/blob/main/contracts/src/layouts/rfrfffcff.cairo

import { AreaType } from "../types/area";
import { Move } from "../types/move";
import { Direction, DirectionType } from "../types/direction";
import { Spot, SpotType } from "../types/spot";

export class Configuration {
  public static starts(): Array<SpotType> {
    return [SpotType.Center, SpotType.East, SpotType.South, SpotType.West];
  }

  public static moves(from: SpotType): Array<Move> {
    switch (from) {
      case SpotType.Center:
      case SpotType.North:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.South),
          ),
        ];
      case SpotType.NorthWest:
      case SpotType.West:
      case SpotType.SouthWest:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.SouthWest),
          ),
          new Move(new Direction(DirectionType.West), new Spot(SpotType.East)),
        ];
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
        return [
          new Move(
            new Direction(DirectionType.North),
            new Spot(SpotType.SouthEast),
          ),
          new Move(new Direction(DirectionType.East), new Spot(SpotType.West)),
        ];
      case SpotType.South:
        return [
          new Move(
            new Direction(DirectionType.South),
            new Spot(SpotType.North),
          ),
        ];
      default:
        return [];
    }
  }

  public static area(from: SpotType): AreaType {
    switch (from) {
      case SpotType.Center:
      case SpotType.North:
        return AreaType.A;
      case SpotType.NorthWest:
      case SpotType.West:
      case SpotType.SouthWest:
        return AreaType.B;
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
        return AreaType.C;
      case SpotType.South:
        return AreaType.D;
      default:
        return AreaType.None;
    }
  }

  public static adjacentRoads(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.SouthWest:
      case SpotType.West:
        return [SpotType.Center];
      default:
        return [];
    }
  }

  public static adjacentCities(from: SpotType): Array<SpotType> {
    switch (from) {
      case SpotType.NorthWest:
      case SpotType.NorthEast:
      case SpotType.East:
      case SpotType.SouthEast:
      case SpotType.SouthWest:
      case SpotType.West:
        return [SpotType.South];
      default:
        return [];
    }
  }
}
