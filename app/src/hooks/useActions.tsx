import { useMemo } from "react";

import { useQueryParams } from "@/hooks/useQueryParams";
import { useGameStore } from "@/store";
import { useDojo } from "@/dojo/useDojo";
import { useBuilder } from "./useBuilder";
import { Account } from "starknet";

export const useActions = () => {
  const { gameId } = useQueryParams();
  const {
    orientation,
    x,
    y,
    character,
    spot,
    selectedTile,
    resetX,
    resetY,
    resetOrientation,
    resetCharacter,
    resetSpot,
    resetSelectedTile,
    resetHoveredTile,
    valid,
  } = useGameStore();

  const {
    account: { account },
    setup: {
      systemCalls: { build },
    },
  } = useDojo();

  const { builder } = useBuilder({ gameId, playerId: account.address });

  const disabled = useMemo(() => {
    const selected = selectedTile.row !== 0 && selectedTile.col !== 0;
    return !selected || !valid || !builder?.tileId;
  }, [valid, builder, selectedTile]);

  const handleClick = () => {
    if (builder?.tileId) {
      try {
        build({
          account: account as Account,
          game_id: gameId,
          tile_id: builder.tileId,
          orientation: orientation,
          x: x,
          y: y,
          role: character,
          spot: spot,
        });
      } catch (e) {
        console.log(e);
      } finally {
        // Reset the settings
        resetX();
        resetY();
        resetCharacter();
        resetSpot();
        resetSelectedTile();
        resetHoveredTile();
      }
    }
  };

  return {
    handleClick,
    disabled,
    builder,
  };
};
