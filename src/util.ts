import type { IBoard, IPiece, IState } from "./model"

export const createEmptyBoard = (boardSize: number) =>
  Array.from({ length: Math.pow(boardSize, 2) }).map(() => null)

export const createRainbowBoard = (boardSize: number) =>
  Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => ({
    hue: (i * 60) % 360,
  }))

export const choose = <T>(values: T[]) =>
  values[Math.floor(Math.random() * values.length)]

export const getPieceSize = (p: IPiece) => ({
  width: getPieceWidth(p),
  height: getPieceHeight(p),
})
export const getPieceWidth = (p: IPiece) => p[0].length
export const getPieceHeight = (p: IPiece) => p.length

export function checkIfPieceFitsAndUpdateBoard({
  board,
  piece,
  squareLocation,
  boardSize,
}: {
  board: IBoard
  piece: IPiece
  squareLocation: [number, number]
  boardSize: number
}): [true, IBoard] | [false, null] {
  const { width, height } = getPieceSize(piece)
  const pieceLocation = [0, 0]
  const pieceMinX = squareLocation[0] - pieceLocation[1]
  const pieceMinY = squareLocation[1] - pieceLocation[0]
  const pieceMaxX = pieceMinX + width
  const pieceMaxY = pieceMinY + height - 1

  if (
    pieceMinX < 0 ||
    pieceMinY < 0 ||
    pieceMaxX > boardSize ||
    pieceMaxY > boardSize
  ) {
    return [false, null]
  }

  const updatedBoard = board.slice()

  for (let i = 0; i < piece.length; i++) {
    const row = piece[i]

    for (let j = 0; j < row.length; j++) {
      const boardIndex = pieceMinX + pieceMinY * boardSize + i * boardSize + j
      const boardSquare = board[boardIndex]
      const pieceSquare = row[j]

      if (pieceSquare === 0) {
        continue
      }

      if (boardSquare !== null) {
        return [false, null]
      }
      updatedBoard[boardIndex] = { hue: 200 }
    }
  }

  return [true, updatedBoard]
}

export function clearFullRows(
  board: IBoard,
  boardSize: number
): [IBoard, number] {
  let rowsAndColsCleared = 0

  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const rowStartIndex = i * boardSize
    const rowEndIndex = rowStartIndex + boardSize - 1
    const row = board.slice(rowStartIndex, rowEndIndex)
    const isFull = row.every((square) => square !== null)

    if (isFull) {
      rowsAndColsCleared++
      for (let i = rowStartIndex; i <= rowEndIndex; i++) {
        board[i] = null
      }
    }
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    const col = []
    const indices = []
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = j * boardSize + i
      indices.push(squareIndex)
      col.push(board[squareIndex])
    }
    const isFull = col.every((square) => square !== null)
    if (isFull) {
      rowsAndColsCleared++
      for (const x of indices) {
        board[x] = null
      }
    }
  }
  return [board, rowsAndColsCleared]
}

export function generateFitTest(
  state: IState,
  squareLocation: [number, number]
): [boolean, string] {
  const shouldSucceed = confirm("Should this be allowed?")
  const verb = shouldSucceed ? "succeed" : "fail"
  const noun = shouldSucceed ? "succees" : "failure"

  const test = `it("${verb}s with placing ?", () => {
    const ${noun}State: IState = {
      highscore: ${state.highscore},
      board: ${
        state.board.every((s) => s === null)
          ? "{1}"
          : JSON.stringify(state.board)
      },
      userPieces: ${JSON.stringify(state.userPieces)},
      selectedPieceIndex: ${JSON.stringify(state.selectedPieceIndex)},
      score: ${state.score},
    }

    const ${noun}SquareLocation: [number, number] = ${JSON.stringify(
    squareLocation
  )}
    const result = checkIfPieceFits(
      ${noun}State.board,
      ${noun}State.userPieces[${noun}State.selectedPiece!.index]!,
      ${noun}State.selectedPiece!.location,
      ${noun}SquareLocation
    )
    expect(result).toBe(${shouldSucceed.toString()})
  })`

  return [shouldSucceed, test]
}

export function calculateLocationFromIndex(
  index: number,
  boardSize: number
): [number, number] {
  const x = index % boardSize
  const y = Math.floor(index / boardSize)
  return [x, y]
}

export function snapPositionToBoard({
  boardSize,
  width,
  height,
  x,
  y,
  pageX,
  pageY,
}: {
  boardSize: number
  width: number
  height: number
  x: number
  y: number
  pageX: number
  pageY: number
}) {
  const pointerXRelative = pageX - x
  const pointerYRelative = pageY - y

  const { colIndex, rowIndex } = mapRelativePositionToIndices({
    width,
    height,
    pointerXRelative,
    pointerYRelative,
    boardSize,
  })
  return {
    colIndex,
    rowIndex,
   }
}

export function mapRelativePositionToIndices({
  width,
  height,
  boardSize,
  pointerXRelative,
  pointerYRelative,
}: {
  width: number
  height: number
  boardSize: number
  pointerXRelative: number
  pointerYRelative: number
}) {
  const colIndex = Math.round((pointerXRelative / width) * (boardSize))
  const rowIndex = Math.round((pointerYRelative / height) * (boardSize))
  return { colIndex, rowIndex }
}
