export type IBoard = (ISquare | null)[]

export interface ISquare {
  hue: number
}

export type IPiece = number[][]

export interface IState {
  highscore: number
  board: IBoard
  userPieces: (IPiece | null)[]
  selectedPieceIndex: number | null
  score: number
}
