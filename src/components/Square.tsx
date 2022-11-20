import type { CSSProperties, HTMLProps } from "react"
import type { ISquare } from "../model"

export function Square({
  square,
  blink = false,
  ...props
}: { square: ISquare | null; blink?: boolean } & HTMLProps<HTMLDivElement>) {
  const conditionalProps = square
    ? {
        style: {
          "--hue": square.hue,
          ...blink ? {
            animation: "blink 1s infinite",
          } : {

          }
         } as CSSProperties,
        className: "square filled",
      }
    : {
        className: "square",
      }

  return <div {...props} {...conditionalProps} />
}
