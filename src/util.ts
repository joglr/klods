import { boardSize } from "./constants"
import type { IBoard, IPiece } from "./model"

export const createEmptyBoard = () =>
  Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => (null))

export const createRainbowBoard = () =>
  Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => ({ hue: (i * 60) % 360 }))

export const choose = <T>(values: T[]) => values[Math.floor(Math.random() * values.length)]

export function checkIfPieceFits(
  board: IBoard,
  piece: IPiece,
  pieceLocation: [number, number],
  squareLocation: [number, number]
): boolean {
  return true
}

export function calculateLocationFromIndex(index: number, boardSize: number): [number, number] {
  const x = index % boardSize
  const y = Math.floor(index / boardSize)
  return [x, y]
}
