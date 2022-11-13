import { useState } from 'react'
import './App.css'
import { pieces } from './pieces'
import { ISquare } from './model'
import { Square } from './components/Square'

export default function App() {
  const [state, setState] = useState<State>(getInitialState)
  const [mousePos, setMousePos] = useState({
    offset: [0, 0],
    pos: [0, 0]
  })

  const resetGame = () => setState(prevState => ({
    ...getInitialState(),
    highscore: Math.max(prevState.highscore, prevState.score)
  }))

  return (
    <div className="app"
      onPointerUp={() => setState(prevState => ({...prevState, selectedPiece: null }))}
      onPointerMove={e => setMousePos(p => ({...p, pos: [e.pageX, e.pageY] }))}
      >
      <header className="header">
        <h1>Klods</h1>
        <div>Score: {state.score}</div>
        <div>High Score: {state.highscore}</div>
        {/* <div>Mouse: {mousePos.pos.join(", ")}</div>
        <div>Offset: {mousePos.offset.join(", ")}</div> */}
        <button onClick={resetGame}>Reset game</button>
      </header>
      <div className="board">
        {state.board.map((square, i) => <Square key={i}square={square} />)}
      </div>
      <div className="user-pieces">
        {state.userPieces.map((piece, i) =>
          <div key={i} className="piece"
            style={{
              gridTemplateColumns: `repeat(${piece[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${piece.length}, 1fr)`,
              ...state.selectedPiece === i ? {
                transform: `translate(${mousePos.pos[0] - mousePos.offset[0]}px,${mousePos.pos[1] - mousePos.offset[1]}px)`,
              } : {

              }
            }}
            onPointerDown={e => {
              setState(prevState => ({...prevState, selectedPiece: i }))
              setMousePos({
                offset: [e.pageX, e.pageY],
                pos: [e.pageX, e.pageY]
              })
              e.preventDefault()
            }}
          >
            {piece.map((rows, j) => (
              <>
                {rows.map((fill, k) => <Square key={k} square={fill === 1 ? {
                  hue: 100,
                } : null} title={`Piece ${i}`} />)}
              </>))
            }
        </div>)}
      </div>
    </div>
  )
}


const boardSize = 8

interface State {
  highscore: number
  board: (ISquare | null)[]
  userPieces: number[][][]
  selectedPiece: null | number
  score: 0
}

const getInitialState: () => State = () => ({
  // 2D array containing board state
  highscore: 0,
  board:
    Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => (null)),
  // Array.from({ length: Math.pow(boardSize, 2) }).map((_, i) => ({ hue: (i * 60) % 360 })),
  userPieces: getNewPieces(),
  selectedPiece: null,
  score: 0
})

/*
1. Setup
*/

// function setup() {
//   clearBoard() //Initial board is empty
//   resetScore()
//   refillPieces() // The user is given three pieces they can choose to place.
//   drawBoard(board)
// }

/*
2. User interaction
*/
// function pointerDragged() {
//   // Snap piece into available space
//   const [newBoard, canPlace] = attemptPlace(piece, location, board)

//   if (canPlace) {
//     drawBoard(newBoard)
//   }
//   // TODO: Show snapped preview
// }

// function pointerUp() {
//   // If the piece can be placed at the current position
//     // Place the piece and remove it from the userPieces

//   // Else move it back to the userPieces

//   if (userPieces.length == 0) {
//     // refillPieces()
//   }
// }



function clearBoard() {
  throw new Error('Function not implemented.')
}

function getNewPieces() {
  const first = pieces[Math.floor(Math.random() * pieces.length)]
  const second = pieces[Math.floor(Math.random() * pieces.length)]
  const third = pieces[Math.floor(Math.random() * pieces.length)]

  return [first, second, third]
}

function attemptPlace(piece: any, location: Location, board: any[]): [any, any] {
  throw new Error('Function not implemented.')
}

function drawBoard(newBoard: any) {
  throw new Error('Function not implemented.')
}

