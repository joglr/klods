import { boardSize } from "./constants"
import type { IBoard, IPiece } from "./model"

export const createEmptyBoard = () =>
  Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => (null))

export const createRainbowBoard = () =>
  Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => ({ hue: (i * 60) % 360 }))

export const choose = <T>(values: T[]) => values[Math.floor(Math.random() * values.length)]
