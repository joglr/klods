import { pieces } from "../pieces"
import { drawPiecesAndRefillBag } from "../util"

describe("drawPiecesAndRefillBag", () => {
  it("it restocks pieces correctly when piece bag is empty", () => {
    const { bag, userPieces } = drawPiecesAndRefillBag([])
    expect(userPieces.length).toBe(3)
    expect(bag.length).toBe(pieces.length - 3)
  })
  it("it restocks pieces correctly when piece bag is less than 3 pieces", () => {
    const { bag, userPieces } = drawPiecesAndRefillBag([[[1]], [[2]]])
    expect(userPieces.length).toBe(3)
    expect(bag.length).toBe(pieces.length - 1)
  })
  it("it restocks pieces correctly when piece bag has 3 pieces", () => {
    const { bag, userPieces } = drawPiecesAndRefillBag([[[1]], [[2]], [[3]]])
    expect(userPieces.length).toBe(3)
    expect(bag.length).toBe(pieces.length)
  })
  it("it doesn't restock pieces when piece bag has 4 pieces", () => {
    const { bag, userPieces } = drawPiecesAndRefillBag([
      [[1]],
      [[2]],
      [[3]],
      [[4]],
    ])
    expect(userPieces.length).toBe(3)
    expect(bag.length).toBe(1)
  })
})
