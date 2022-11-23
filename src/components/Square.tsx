import type { CSSProperties, HTMLProps } from "react"
import type { ISquare } from "../model"

export function Square({
  square,
  blink = false,
  hasTransition,
  ...props
}: { square: ISquare | null; blink?: boolean, hasTransition?: boolean } & HTMLProps<HTMLDivElement>) {
  const classes = ["square"]
  if (hasTransition) classes.push("transition")
  const conditionalProps = square
    ? {
        style: {
          "--hue": square.hue,
          ...blink ? {
            animation: "blink 1s infinite",
          } : {
          }
        } as CSSProperties,
        className: classes.join(" "),
      }
      : {
        className: classes.join(" "),
        style: {
          "--hue": 0,
          "--sat": 0,
          "--lig": 0,
          "--opa": 0,
        } as CSSProperties
      }

  return <div {...props} {...conditionalProps} />
}
