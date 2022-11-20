type s = ISquare | null

export type IBoard = [
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
  s, s, s, s, s, s, s, s,
]
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
