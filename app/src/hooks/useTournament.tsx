import { useDojo } from "@/dojo/useDojo";
import { useMemo } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

export const useTournament = ({
  tournamentId,
}: {
  tournamentId: number | undefined;
}) => {
  const {
    setup: {
      clientModels: {
        models: { Tournament },
        classes: { Tournament: TournamentClass },
      },
    },
  } = useDojo();

  const tournamentKey = useMemo(
    () => getEntityIdFromKeys([BigInt(tournamentId || 0)]) as Entity,
    [tournamentId],
  );
  const component = useComponentValue(Tournament, tournamentKey);
  const tournament = useMemo(() => {
    return component ? new TournamentClass(component) : null;
  }, [component]);

  return { tournament, tournamentKey };
};
