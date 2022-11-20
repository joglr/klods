import { hues } from "../constants";
import { pieces } from "../pieces";
import { pickOne } from "../util";
import { Square } from "./Square";

export function PieceDisplay() {
  return (
    <div className="user-pieces">
      {pieces.map((piece, i) => {
        const hue = pickOne(hues);
        return (
          <div
            key={i}
            className="piece"
            style={{
              gridTemplateColumns: `repeat(${piece[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${piece.length}, 1fr)`,
            }}
          >
            {piece.map((rows, j) => (
              <>
                {rows.map((fill, k) => (
                  <Square
                    key={k}
                    square={
                      fill === 1
                        ? {
                            hue: hue,
                          }
                        : null
                    }
                    title={`Piece ${i}`}
                  />
                ))}
              </>
            ))}
          </div>
        );
      })}
    </div>
  );
}
