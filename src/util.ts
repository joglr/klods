import { boardSize } from "./constants"
import type { IBoard, IPiece, IState } from "./model"

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

  /*

  ASCII art of the board:
    | 0  1  2  3  4  5  6  7
  0 |
  1 |
  2 |
  3 |
  4 |
  5 |                      1
  6 |                      1
  7 |                1  1  X

   */
  const pieceWidth = piece[0].length
  const pieceHeight = piece.length
  const pieceMinX = squareLocation[0] - (pieceLocation[1])
  const pieceMinY = squareLocation[1] - (pieceLocation[0])
  const pieceMaxX = pieceMinX + pieceWidth - 1
  const pieceMaxY = pieceMinY + pieceHeight - 1

  if (pieceMinX < 0 || pieceMinY < 0 || pieceMaxX > boardSize || pieceMaxY > boardSize) {
    return false
  }

  let fits = true

  for(let i = 0; i < piece.length; i++) {
    const row = piece[i]

    for(let j = 0; j < row.length; j++) {
      // Check that the square is empty
      // if piece[i][j] is 1 and square !== null

    }
  }

  return fits
}

export function generateFitTest(state: IState, squareLocation: [number, number]): [boolean, string] {
  const shouldSucceed = confirm("Should this be allowed?")
  const placeholderState = {
    ...state,
    board: "{1}"
  }

  const verb = shouldSucceed ? "succeed" : "fail"
  const noun = shouldSucceed ? "succees" : "failure"

  const test = `it("${verb}s with placing ?", () => {
    const ${noun}State{N}: IState = {
      highscore: ${placeholderState.highscore},
      board: createEmptyBoard(),
      userPieces: ${JSON.stringify(placeholderState.userPieces)},
      selectedPiece: ${JSON.stringify(placeholderState.selectedPiece)},
      score: ${placeholderState.score},
    }

    const ${noun}SquareLocation{N}: [number, number] = ${JSON.stringify(squareLocation)}
    const result = checkIfPieceFits(
      ${noun}State{N}.board,
      ${noun}State{N}.userPieces[${noun}State{N}.selectedPiece!.index],
      ${noun}State{N}.selectedPiece!.location,
      ${noun}SquareLocation{N}
    )
    expect(result).toBe(${shouldSucceed.toString()})
  })`

  return [shouldSucceed, test]
}

export function calculateLocationFromIndex(index: number, boardSize: number): [number, number] {
  const x = index % boardSize
  const y = Math.floor(index / boardSize)
  return [x, y]
}
