import { mapRelativePositionToIndices } from "../src/util"

describe("mapRelativePositionToIndices", () => {
  /*
  Scenario:
  Board width is 800x800 pixels and 8x8 squares
  This means that 0 < x < 100 should be 0
  */
  it("maps correctly", () => {
    const result = mapRelativePositionToIndices({
      width: 800,
      height: 800,
      boardSize: 8,
      pointerXRelative: 50,
      pointerYRelative: 50,
    })
    expect(result.colIndex).toBe(0)
    expect(result.rowIndex).toBe(0)
  })
  /*  This means that 700 < x < 800 should be 7 */
  it("maps correctly", () => {
    const result = mapRelativePositionToIndices({
      width: 800,
      height: 800,
      boardSize: 8,
      pointerXRelative: 750,
      pointerYRelative: 750,
    })
    expect(result.colIndex).toBe(7)
    expect(result.rowIndex).toBe(7)
  })
})
