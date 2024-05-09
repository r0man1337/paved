import { useMemo } from "react";
import { TileTexture } from "./TileTexture";
import { TileEmpty } from "./TileEmpty";
import { useTiles } from "@/hooks/useTiles";

export const TileTextures = ({ squareSize }: { squareSize: number }) => {
  const { tiles, items } = useTiles();

  console.log;
  const renderedItems = useMemo(() => {
    return Object.keys(items).map((key: string, index) => {
      const item = items[key];
      if (item.empty) {
        return (
          <TileEmpty
            key={index}
            tiles={tiles}
            col={item.tile.col}
            row={item.tile.row}
            size={squareSize}
          />
        );
      } else {
        return <TileTexture key={index} tile={item.tile} size={squareSize} />;
      }
    });
  }, [items, squareSize]);

  return <>{renderedItems}</>;
};
