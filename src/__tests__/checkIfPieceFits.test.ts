import { IState } from "../model";
import { checkIfPieceFits, createEmptyBoard } from "../util";

// Placement of wedge piece of in top left corner
const successState1: IState = {
  highscore: 0,
  board: createEmptyBoard(),
  userPieces: [
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
  ],
  selectedPiece: {
    index: 1,
    location: [0, 0],
  },
  score: 0,
};
const successSquareLocation1: [number, number] = [0, 0]

describe("checkIfPieceFits", () => {
  it("succeeds with placement of wedge piece of in top left corner", () => {
    const result = checkIfPieceFits(
      successState1.board,
      successState1.userPieces[successState1.selectedPiece!.index],
      successState1.selectedPiece!.location,
      successSquareLocation1
    );
    expect(result).toBe(true);
  });
});
