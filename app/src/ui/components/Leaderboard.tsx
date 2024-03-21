import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useDojo } from "@/dojo/useDojo";
import { useQueryParams } from "@/hooks/useQueryParams";
import { shortString } from "starknet";
import { getOrder, getColor } from "@/dojo/game";
import {
  defineEnterSystem,
  defineSystem,
  Has,
  HasValue,
} from "@dojoengine/recs";
import { useLogs } from "@/hooks/useLogs";
import { Claim } from "./Claim";
import { TwitterShareButton } from "react-share";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useGame } from "@/hooks/useGame";
import { useBuilder } from "@/hooks/useBuilder";
import { usePlayer } from "@/hooks/usePlayer";
import html2canvas from "html2canvas";

export const LeaderboardDialog = () => {
  const { gameId } = useQueryParams();
  const {
    account: { account },
  } = useDojo();

  const { game } = useGame({ gameId });
  const { builder } = useBuilder({
    gameId: gameId,
    playerId: account?.address,
  });

  const [open, setOpen] = useState(false);
  const [over, setOver] = useState(false);
  const [screenshotProcessing, setScreenshotProcessing] = useState(false);

  useEffect(() => {
    if (game) {
      const interval = setInterval(() => {
        if (!over && game.isOver()) {
          setOpen(true);
          setOver(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [game, over]);

  useEffect(() => {
    if (screenshotProcessing && !open) {
      html2canvas(document.body).then((canvas) => {
        const dataURL = canvas.toDataURL();
        console.log(dataURL);
        // Convertir le canvas en blob
        canvas.toBlob((blob) => {
          // Créer un ClipboardItem contenant l'image
          if (!blob) return;
          const item = new ClipboardItem({ "image/png": blob });

          // Copier le ClipboardItem dans le presse-papiers
          navigator.clipboard
            .write([item])
            .then(() => {
              setScreenshotProcessing(false);
              setOpen(true); // Réouvrir la modale après la capture d'écran
            })
            .catch((error) => {
              console.error(
                "Impossible de copier l'image dans le presse-papiers:",
                error
              );
              setScreenshotProcessing(false);
              setOpen(true);
            });
        }, "image/png");
      });
    }
  }, [screenshotProcessing, open]);

  const handleScreenshot = () => {
    setScreenshotProcessing(true);
    setOpen(false); // Fermer la modale avant de prendre le screenshot
  };

  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"command"} size={"command"}>
                <FontAwesomeIcon className="h-12" icon={faTrophy} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="select-none">Leaderboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      {!screenshotProcessing && (
        <DialogContent>
          <DialogHeader className="flex items-center">Leaderboard</DialogHeader>
          {over && builder && (
            <Description game={game} handleScreenshot={handleScreenshot} />
          )}
          <Leaderboard />
          {over && !game.isSoloMode() && builder && <Reward />}
        </DialogContent>
      )}
    </Dialog>
  );
};

export const Description = ({
  game,
  handleScreenshot,
}: {
  game: any;
  handleScreenshot: () => void;
}) => {
  return (
    <DialogDescription className="flex justify-center items-center gap-3 text-xs">
      Game is over!
      <Screenshot handleScreenshot={handleScreenshot} />
      {game.isSoloMode() && <Share score={game.score} />}
    </DialogDescription>
  );
};

export const Screenshot = ({
  handleScreenshot,
}: {
  handleScreenshot: () => void;
}) => {
  return (
    <Button
      className="flex gap-2 w-auto p-2 text-xs"
      variant={"secondary"}
      size={"icon"}
      onClick={handleScreenshot}
    >
      <FontAwesomeIcon icon={faCamera} />
    </Button>
  );
};

export const Reward = () => {
  return (
    <DialogDescription className="flex justify-center items-center gap-4 text-xs">
      Claim your rewards!
      <Claim />
    </DialogDescription>
  );
};

export const Share = ({ score }: { score: number }) => {
  return (
    <TwitterShareButton
      url="#gaming #onetileatatime"
      title={`I just play tested @pavedgame’s solo mode ⚒️

Score: ${score}

Join the fun at https://paved.gg/ and #paveyourwaytovictory in an onchain strategy game like no other 👀

`}
    >
      <Button
        className="flex gap-2 w-auto p-2 text-xs"
        variant={"default"}
        size={"icon"}
      >
        <FontAwesomeIcon icon={faXTwitter} />
        <p>Share</p>
      </Button>
    </TwitterShareButton>
  );
};

export const Leaderboard = () => {
  const { gameId } = useQueryParams();
  const [builders, setBuilders] = useState<{ [key: number]: typeof Builder }>(
    {}
  );
  const [topBuilders, setTopBuilders] = useState<any>([]);
  const { logs } = useLogs();
  const {
    setup: {
      world,
      clientModels: {
        models: { Builder },
      },
    },
  } = useDojo();

  useMemo(() => {
    defineEnterSystem(
      world,
      [Has(Builder), HasValue(Builder, { game_id: gameId })],
      function ({ value: [builder] }: any) {
        setBuilders((prevTiles: any) => {
          return { ...prevTiles, [builder.player_id]: builder };
        });
      }
    );
    defineSystem(
      world,
      [Has(Builder), HasValue(Builder, { game_id: gameId })],
      function ({ value: [builder] }: any) {
        setBuilders((prevTiles: any) => {
          return { ...prevTiles, [builder.player_id]: builder };
        });
      }
    );
  }, []);

  useEffect(() => {
    if (!builders) return;

    const topSortedBuilders: (typeof Builder)[] = Object.values(builders).sort(
      (a, b) => {
        return b?.score - a?.score;
      }
    );

    setTopBuilders(topSortedBuilders);
  }, [builders]);

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Paved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topBuilders.map((builder: typeof Builder, index: number) => {
          return (
            <PlayerRow
              key={index}
              builder={builder}
              rank={index + 1}
              logs={logs.filter((log) => log.category === "Built")}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export const PlayerRow = ({
  builder,
  rank,
  logs,
}: {
  builder: any;
  rank: number;
  logs: any;
}) => {
  const { player } = usePlayer({ playerId: builder.player_id });
  const name = shortString.decodeShortString(player?.name || "");
  const order = getOrder(builder?.order);
  const address = `0x${builder.player_id.toString(16)}`;
  const backgroundColor = getColor(address);
  const paved = logs.filter((log: any) => log.color === backgroundColor).length;
  return (
    <TableRow>
      <TableCell className="font-medium">{rank}</TableCell>
      <TableCell className="flex gap-2 text-ellipsis">
        <div className="rounded-full w-4 h-4" style={{ backgroundColor }} />
        {name}
      </TableCell>
      <TableCell>{order}</TableCell>
      <TableCell className="text-right">{builder?.score}</TableCell>
      <TableCell className="text-right">{paved}</TableCell>
    </TableRow>
  );
};
