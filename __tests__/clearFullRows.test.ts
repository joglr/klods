import { IBoard } from "../src/model"
import { clearFullRows, createEmptyBoard } from "../src/util"

const _ = null
const s = { hue: 200 }

describe("clearFullRows", () => {
  it("does not clear an empty board", () => {
    const board: IBoard = [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
    ]
    const { rowsAndColsCleared } = clearFullRows(board, 8)
    expect(rowsAndColsCleared).toBe(0)
  })

  it("clears a single row properly", () => {
    const board: IBoard = [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      s, s, s, s, s, s, s, s,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
    ]
    const { newBoard, rowsAndColsCleared } = clearFullRows(board, 8)
    expect(rowsAndColsCleared ).toBe(1)
    expect(newBoard).toEqual(createEmptyBoard(8))
  })

  it("clears a single row properly", () => {
    const board: IBoard = [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      s, s, s, s, s, s, s, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
    ]
    const { newBoard, rowsAndColsCleared } = clearFullRows(board, 8)
    expect(rowsAndColsCleared ).toBe(0)
    expect(newBoard).toEqual(board)
  })

  it("does not clear almost full rows", () => {
    const board: IBoard = [
      s, s, s, s, s, s, s, _,
      s, s, s, s, s, s, _, s,
      s, s, s, s, s, _, s, s,
      s, s, s, s, _, s, s, s,
      s, s, s, _, s, s, s, s,
      s, s, _, s, s, s, s, s,
      s, _, s, s, s, s, s, s,
      _, s, s, s, s, s, s, s,
    ]
    const { newBoard, rowsAndColsCleared } = clearFullRows(board, 8)
    expect(rowsAndColsCleared).toBe(0)
    expect(newBoard).toEqual(board)
  })

  it("does not clear almost full rows", () => {
    const board: IBoard = [
      _, s, s, s, s, s, s, s,
      s, _, s, s, s, s, s, s,
      s, s, _, s, s, s, s, s,
      s, s, s, _, s, s, s, s,
      s, s, s, s, _, s, s, s,
      s, s, s, s, s, _, s, s,
      s, s, s, s, s, s, _, s,
      s, s, s, s, s, s, s, _,
    ]
    const { newBoard, rowsAndColsCleared } = clearFullRows(board, 8)
    expect(rowsAndColsCleared).toBe(0)
    expect(newBoard).toEqual(board)
  })

})
