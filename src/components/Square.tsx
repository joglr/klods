import type { CSSProperties, HTMLProps } from "react"
import type { ISquare } from "../model"

export function Square({ square, ...props }: {square: ISquare | null} & HTMLProps<HTMLDivElement>) {
  const conditionalProps = square ? {
    style: { "--hue": square.hue, } as CSSProperties,
    className: "square filled"
  } : {
    className: "square"
  }

  return <div {...props} {...conditionalProps} />
}
