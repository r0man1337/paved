import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useDojo } from "../../dojo/useDojo";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePlayer } from "@/hooks/usePlayer";
import { Account } from "starknet";

const MAX_TILES = 255;

export const Buy = ({ buttonName }: { buttonName?: string }) => {
  const [quantity, setQuantity] = useState(0);
  const [max, setMax] = useState(0);
  const {
    account: { account },
    setup: {
      systemCalls: { buy },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  useEffect(() => {
    if (player) setMax(MAX_TILES - player?.bank);
  }, [player]);

  useEffect(() => {
    // Reset quantity after buying
    if (player) setQuantity(0);
  }, [player]);

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger disabled={!player}>
              <Button
                disabled={!player}
                variant={buttonName ? "secondary" : "command"}
                size={buttonName ? "default" : "command"}
              >
                {buttonName ? (
                  <p>{buttonName}</p>
                ) : (
                  <FontAwesomeIcon className="h-12" icon={faCartPlus} />
                )}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="select-none">Purchase menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase new tiles</DialogTitle>
          <DialogDescription>
            Enter the quantity you wish to buy (bank cannot exceed {MAX_TILES}).
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-center justify-center gap-4">
          <Input
            className="`grow"
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              if (e.target.value) {
                const value = parseInt(e.target.value);
                if (value > 0 && value < max) {
                  setQuantity(value);
                } else if (value <= 0) {
                  setQuantity(0);
                } else {
                  setQuantity(max);
                }
              } else {
                setQuantity(0);
              }
            }}
          />
          <Button
            variant={"default"}
            size={"icon"}
            className="w-14"
            onClick={() => {
              setQuantity(MAX_TILES - (player ? player.bank : 0));
            }}
          >
            Max
          </Button>
        </div>

        {!max && (
          <p className="text-center text-xs text-red-300">Bank limit reached</p>
        )}

        <DialogClose asChild>
          <Button
            disabled={!quantity}
            variant={"default"}
            onClick={() =>
              buy({ account: account as Account, amount: quantity })
            }
          >
            Confirm
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
