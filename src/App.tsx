import { useEffect, useRef, useState } from 'react'
import './App.css'
import { pieces } from './pieces'
import type { IPiece, IState } from './model'
import { Square } from './components/Square'
import { checkIfPieceFitsAndUpdateBoard, clearFullRows, createEmptyBoard, generateFitTest } from './util'
import { boardSize, highscoreLocalStorageKey } from './constants'

export default function App() {
  const [state, setState] = useState<IState>(getInitialState)
  const boardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({
    offset: [0, 0],
    pos: [0, 0]
  })

  useEffect(() => {
    const highscore = Math.max(state.highscore, state.score).toString()
    localStorage.setItem(highscoreLocalStorageKey, highscore)
  }, [state.score, state.highscore])

  const resetGame = () => setState(prevState => ({
    ...getInitialState(),
    highscore: Math.max(prevState.highscore, prevState.score)
  }))

  function requestFullscreen() {
    document.documentElement.requestFullscreen()
  }

  return (
    <div className="app"
      onPointerMove={e =>
        {
          if (state.selectedPiece == null ) return
          // e.preventDefault()
          setMousePos(p => ({ ...p, pos: [e.pageX, e.pageY] }))
          return
          //   // TODO: Show snapped preview
        }
      }
      onPointerUp={(e) => {
        if (!boardRef.current) return

        const { width, height, x, y } = boardRef.current.getBoundingClientRect()

        const pointerXRelative = e.pageX - x
        const pointerYRelative = e.pageY - y

        const colIndex = Math.floor(pointerXRelative / width * boardSize)
        const rowIndex = Math.floor(pointerYRelative / height * boardSize)

        if (colIndex < 0 || rowIndex < 0 || colIndex >= boardSize || rowIndex >= boardSize) {
          setState(p => ({...p, selectedPiece: null}))
          return
        }

        const squareLocation: [number, number] = [colIndex, rowIndex]

        if(state.selectedPiece == null) return

        // const [shouldSucceed, newTest] = generateFitTest(state, squareLocation)

        const placedPiece = state.userPieces[state.selectedPiece.index]!
        // Attempt to place piece in square
        let [couldPlace, boardWithPiecePlaced] = checkIfPieceFitsAndUpdateBoard(
          state.board,
          placedPiece,
          state.selectedPiece.location,
          squareLocation
        )

        if (couldPlace) {
          const [updatedBoard, rowsAndColsCleared] = clearFullRows(boardWithPiecePlaced!)
          setState(prevState => {
            const userPieces = prevState.userPieces.map((piece, i) => i === prevState.selectedPiece!.index ? null : piece)
            return ({
              ...prevState,
              board: updatedBoard,
              userPieces: userPieces.every(p => p == null)
                ? getNewPieces()
                : userPieces,
              selectedPiece: null,
              score: prevState.score + rowsAndColsCleared * boardSize
            })
          })
        } else {
          setState(prevState => ({
            ...prevState,
            selectedPiece: null,
          }))
        }

        // if (shouldSucceed !== couldPlace) {
        //   prompt("red test", newTest)
        // }
      }}
      >
      <header className="header">
        <h1>Klods</h1>
        <div>Score: {state.score}</div>
        <div>High Score: {state.highscore}</div>
        {/* {Object.entries(state).map(([key, value]) => (
          <div key={key}>{key}: {JSON.stringify(value, null, 2) }</div>
        ))} */}
        <button onClick={resetGame}>Reset game</button>
        <button onClick={requestFullscreen}>Fullscreen</button>
      </header>
      <section className="game">
        <div
          className="board"
          ref={boardRef}
        >
          {state.board.map((square, i) =>
            <Square key={i} square={square} />
          )}
        </div>
        <div className="user-pieces">
          {state.userPieces.map((piece, i) => piece === null ? <div /> :
            <div key={i} className="piece"
              style={{
                gridTemplateColumns: `repeat(${piece[0].length}, 1fr)`,
                gridTemplateRows: `repeat(${piece.length}, 1fr)`,
                ...state.selectedPiece?.index === i ? {
                  transform: `translate(${mousePos.pos[0] - mousePos.offset[0]}px,${mousePos.pos[1] - mousePos.offset[1]}px)`,
                  pointerEvents: "none",
                  touchAction: "none"
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
                        e.preventDefault()
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
      </section>
    </div>
  )
}

const getInitialState: () => IState = () => ({
  highscore: Number(window.localStorage.getItem(highscoreLocalStorageKey)) ?? 0,
  board: createEmptyBoard(),
  userPieces: getNewPieces(),
  selectedPiece: null,
  score: 0
})

function getNewPieces() {
  const newPieces: IPiece[] = []

  for (let i = 0; i < 3; i++) {
    newPieces.push(pieces[Math.floor(Math.random() * pieces.length)])
  }
  return newPieces
}
