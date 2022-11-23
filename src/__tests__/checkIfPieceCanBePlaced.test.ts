import type { IBoard, IPiece, ISquare } from "../model"
import { checkIfPieceCanBePlaced } from "../util"


const _ = null
const s: ISquare = { hue: 200 }

describe("checkIfPieceCanBePlaced", () => {
  it("returns true if the piece can be placed", () => {
    const piece: IPiece = [
      [1,1],
      [1,1]
    ]

    const board: IBoard = [
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, _, _,
      s, s, s, s, s, s, _, _,
    ]
    const result = checkIfPieceCanBePlaced(board, piece)
    expect(result).toBe(true)
  })
  it("returns true if the piece can be placed", () => {
    const piece: IPiece = [
      [1,1],
      [1,1]
    ]

    const board: IBoard = [
      _, _, s, s, s, s, s, s,
      _, _, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
    ]
    const result = checkIfPieceCanBePlaced(board, piece)
    expect(result).toBe(true)
  })

  it("returns false if the piece cannot be placed", () => {
    const piece: IPiece = [
      [1,1],
      [1,1]
    ]

    const board: IBoard = [
      s, _, s, s, s, s, s, s,
      _, _, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
      s, s, s, s, s, s, s, s,
    ]
    const result = checkIfPieceCanBePlaced(board, piece)
    expect(result).toBe(false)
  })
})
