import { useState } from 'react'
import './App.css'
import { pieces } from './pieces'
import type { IState } from './model'
import { Square } from './components/Square'
import { checkIfPieceFits, createEmptyBoard } from './util'
import { boardSize } from './constants'

export default function App() {
  const [state, setState] = useState<IState>(getInitialState)
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
      onPointerMove={e =>
        {
          if (state.selectedPiece == null ) return
          e.preventDefault()
          return setMousePos(p => ({ ...p, pos: [e.pageX, e.pageY] }))
        }
      }
      onPointerUp={() => {
        if(state.selectedPiece == null) return
        setState(p => ({...p, selectedPiece: null}))
      }}
      >
      <header className="header">
        <h1>Klods</h1>
        {/* <div>Score: {state.score}</div>
        <div>High Score: {state.highscore}</div> */}
        {Object.entries(state).map(([key, value]) => (
          <div key={key}>{key}: {JSON.stringify(value, null, 2) }</div>
        ))}
        <div>{state.selectedPiece?.location.join(",")}</div>
        <button onClick={resetGame}>Reset game</button>
      </header>
      <div
        className="board"
        onPointerMove={() => {
          // console.log("moving over board")
          // TODO: Check if it can be placed here
          // TODO: If it can be placed, draw it
        }}
      >
        {state.board.map((square, i) =>
          <Square
            key={i}
            square={square}
            onPointerUp={() => {
              if (state.selectedPiece == null) return
              setState(prevState => ({
                ...prevState,
                selectedPiece: null,

              }))
            }}
          />
        )}
      </div>
      <div className="user-pieces">
        {state.userPieces.map((piece, i) =>
          <div key={i} className="piece"
            style={{
              gridTemplateColumns: `repeat(${piece[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${piece.length}, 1fr)`,
              ...state.selectedPiece?.index === i ? {
                transform: `translate(${mousePos.pos[0] - mousePos.offset[0]}px,${mousePos.pos[1] - mousePos.offset[1]}px)`,
                pointerEvents: "none"
              } : {}
            }}
          >
            {piece.map((rows, j) => (
              <>
                {rows.map((fill, k) =>
                  <Square
                    key={k}
                    square={
                      fill === 1 ?
                        state.selectedPiece?.location.join(",") === `${j},${k}` &&
                        state.selectedPiece.index === i
                          ? { hue: 200 }
                          : { hue: 100 }
                        : null
                    }
                    title={`${j},${k}`}
                    onPointerDown={e => {
                      setState(prevState => ({
                        ...prevState,
                        selectedPiece: {
                          index: i,
                          location: [j, k]
                        }
                      }))
                      setMousePos({
                        offset: [e.pageX, e.pageY],
                        pos: [e.pageX, e.pageY]
                      })
                      e.preventDefault()
                    }}
                  />
                )}
              </>))
            }
        </div>)}
      </div>
    </div>
  )
}

const getInitialState: () => IState = () => ({
  // 2D array containing board state
  highscore: 0,
  board: createEmptyBoard(),
  userPieces: getNewPieces(),
  selectedPiece: null,
  score: 0
} satisfies IState)

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

