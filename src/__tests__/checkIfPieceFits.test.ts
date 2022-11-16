import { IState } from "../model"
import { checkIfPieceFits, createEmptyBoard } from "../util"

describe("checkIfPieceFits", () => {
  it("succeeds with placing 3x3 wedge piece in bottom right corner", () => {
    const succeesState1: IState = {
      highscore: 0,
      board: createEmptyBoard(),
      userPieces: [[[1,1],[0,1]],[[1,1],[1,1],[1,1]],[[0,0,1],[0,0,1],[1,1,1]]],
      selectedPiece: {"index":2,"location":[2,2]},
      score: 0,
    }

    const succeesSquareLocation1: [number, number] = [7,7]
    const result = checkIfPieceFits(
      succeesState1.board,
      succeesState1.userPieces[succeesState1.selectedPiece!.index]!,
      succeesState1.selectedPiece!.location,
      succeesSquareLocation1
    )
    expect(result).toBe(true)
  })
})
