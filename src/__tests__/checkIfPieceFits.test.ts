import { IPiece, IState } from "../model"
import { checkIfPieceFitsAndUpdateBoard, createEmptyBoard, pieceFromSquares } from "../util"

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
      board: createEmptyBoard(8),
      userPieces: [[[1,1],[0,1]],[[1,1],[1,1],[1,1]],[[0,0,1],[0,0,1],[1,1,1]]].map(pieceFromSquares),
      selectedPieceIndex: 2,
      score: 0,
      bag: []
    }

    const succeesSquareLocation1: [number, number] = [5,5]
    const result = checkIfPieceFitsAndUpdateBoard(
      { board: succeesState1.board, piece: succeesState1.userPieces[succeesState1.selectedPieceIndex!]!, squareLocation: succeesSquareLocation1, boardSize: 8 }    )
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
      userPieces: [[[1,1],[1,0]],[[1,1,1,1],[1,0,0,0]],[[1,1],[0,1],[0,1],[0,1]]].map(pieceFromSquares),
      selectedPieceIndex: 0,
      score: 0,
      bag: []
    }

    const failureSquareLocation: [number, number] = [6,6]
    const result = checkIfPieceFitsAndUpdateBoard(
      { board: failureState.board, piece: failureState.userPieces[failureState.selectedPieceIndex!]!, squareLocation: failureSquareLocation, boardSize: 8 }    )
    expect(result[0]).toBe(false)
  })
})
