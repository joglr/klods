export type IBoard = (ISquare | null)[]

export interface ISquare {
  hue: number
}

export type IPiece = number[][]

export interface IState {
  highscore: number
  board: IBoard
  userPieces: IPiece[]
  selectedPiece: null | IPieceInfo
  score: 0
}

interface IPieceInfo {
  index: number
  location: [number, number]
}
