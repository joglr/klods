import { IState } from "../src/model"
import { checkIfPieceFitsAndUpdateBoard, createEmptyBoard } from "../src/util"

describe("checkIfPieceFits", () => {
  it("succeeds with placing 3x3 wedge piece in bottom right corner", () => {
    /*
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
    const succeesState1: IState = {
      highscore: 0,
      board: createEmptyBoard(),
      userPieces: [[[1,1],[0,1]],[[1,1],[1,1],[1,1]],[[0,0,1],[0,0,1],[1,1,1]]],
      selectedPiece: {"index":2,"location":[2,2]},
      score: 0,
    }

    const succeesSquareLocation1: [number, number] = [7,7]
    const result = checkIfPieceFitsAndUpdateBoard(
      succeesState1.board,
      succeesState1.userPieces[succeesState1.selectedPiece!.index]!,
      succeesState1.selectedPiece!.location,
      succeesSquareLocation1
    )
    expect(result[0]).toBe(true)
  })

  it("fails with wedge piece on top of occupied pieces", () => {
    /*
      | 0  1  2  3  4  5  6  7
    0 |
    1 |
    2 |
    3 |
    4 |
    5 |
    6 |                   X  X
    7 |                   X  X
    */
    const failureState: IState = {
      highscore: 0,
      board: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"hue":200},{"hue":200},null,null,null,null,null,null,{"hue":200},{"hue":200}],
      userPieces: [[[1,1],[1,0]],[[1,1,1,1],[1,0,0,0]],[[1,1],[0,1],[0,1],[0,1]]],
      selectedPiece: {"index":0,"location":[0,0]},
      score: 0,
    }

    const failureSquareLocation: [number, number] = [6,6]
    const result = checkIfPieceFitsAndUpdateBoard(
      failureState.board,
      failureState.userPieces[failureState.selectedPiece!.index]!,
      failureState.selectedPiece!.location,
      failureSquareLocation
    )
    expect(result[0]).toBe(false)
  })
})
