import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { pieces } from './pieces'
import type { IBoard, IPiece, IState } from './model'
import { Square } from './components/Square'
import { checkIfPieceFitsAndUpdateBoard, clearFullRows, createEmptyBoard, generateFitTest, getPieceHeight, getPieceWidth, mapRelativePositionToIndices } from './util'
import { boardSize, getSquareSizePixels, highscoreLocalStorageKey } from './constants'
import { usePointerExit } from './hooks'

export default function App() {
  const [state, setState] = useState<IState>(getInitialState)
  const boardRef = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState<{
    offset: [number, number],
    pos: [number, number],
    type: string
  }>({
    offset: [0, 0],
    pos: [0, 0],
    type: "touch"
  })
  const mousePosWithOffset = useMemo<[number, number]>(() => {
    const [selectedPiece] = tryGetPieceFromState(state)
    const offsets = selectedPiece ? getOffsetFromPieceInPixels(selectedPiece, pointer.type) : [0, 0]

    return ([
      pointer.pos[0] - offsets[0],
      pointer.pos[1] - offsets[1]
    ])
  }, [pointer.pos, pointer.type, state])

  const [fit, boardWithPreview] = useMemo<[boolean, IBoard]>(() => {
    const [selectedPiece] = tryGetPieceFromState(state)
    if (!selectedPiece) return [false, state.board]
    const { colIndex, rowIndex } = snapPositionToBoard(boardRef, ...mousePosWithOffset)
    const [fit, board] = checkIfPieceFitsAndUpdateBoard(
      { board: state.board, piece: selectedPiece, squareLocation: [colIndex, rowIndex], boardSize }    )
    return [fit, fit ? board : state.board]
  }, [mousePosWithOffset, state])

  useEffect(() => {
    const highscore = Math.max(state.highscore, state.score).toString()
    localStorage.setItem(highscoreLocalStorageKey, highscore)
  }, [state.score, state.highscore])

  const resetGame = () => setState(prevState => ({
    ...getInitialState(),
    highscore: Math.max(prevState.highscore, prevState.score)
  }))

  const pointerUpHandler = useCallback(function pointerUpHandler() {
    if (!boardRef.current) return

    if (!fit) {
      setState(p => ({...p, selectedPiece: null}))
      return
    }

    // const squareLocation: [number, number] = [0, 0]
    // const [shouldSucceed, newTest] = generateFitTest(state, squareLocation)

    const [selectedPiece, selectedPieceIndex] = tryGetPieceFromState(state)
    if (!selectedPiece) return

    const [updatedBoard, rowsAndColsCleared] = clearFullRows(boardWithPreview, boardSize)
    setState(prevState => {
      const userPieces = prevState.userPieces.map((piece, i) => i === selectedPieceIndex ? null : piece)
      return ({
        board: updatedBoard,
        userPieces: userPieces.every(p => p == null)
          ? getNewPieces()
          : userPieces,
        selectedPieceIndex: null,
        score: prevState.score + rowsAndColsCleared * boardSize,
        highscore: prevState.highscore
      })
    })

    // if (shouldSucceed !== fit) {
    //   prompt("red test", newTest)
    // }
  }, [boardWithPreview, fit, state])

  usePointerExit(pointerUpHandler)

  return (
    <div className="app"
      onPointerMove={e =>
        {
          if (state.selectedPieceIndex == null ) return
          setPointer(p => ({
            ...p,
            pos: [
              e.pageX,
              e.pageY
            ]
          }))
        }
      }
      onPointerUp={pointerUpHandler}
      >
      <div className="app-wrapper">
        <header className="header">
          <h1>Klods</h1>
          <div className="options">
            <div>Score: {state.score}</div>
            <div>High Score: {state.highscore}</div>
            <button onClick={resetGame}>Reset game</button>
            <button onClick={() => document.documentElement.requestFullscreen()}>Fullscreen</button>
          </div>
        </header>
        <main className="game">
          <div className="board-wrapper">
            <div
              className="board"
              ref={boardRef}
            >
              {boardWithPreview.map((square, i) =>
                <Square key={i} square={square} />
              )}
            </div>
          </div>
          <div className="user-pieces">
            {state.userPieces.map((piece, i) => piece === null ? <div /> :
              <div className="piece" key={i}
                onPointerDown={e => {
                  // Prevent drag behaviour
                  e.preventDefault()

                  // Select the piece that was dragged from
                  setState(prevState => ({
                    ...prevState,
                    selectedPieceIndex: i
                  }))
                  setPointer({
                    offset: [e.pageX, e.pageY],
                    pos: [e.pageX, e.pageY],
                    type: e.pointerType
                  })
                }}
              >
                <div className="piece-grid"
                  style={{
                    gridTemplateColumns: `repeat(${piece[0].length}, 1fr)`,
                    gridTemplateRows: `repeat(${piece.length}, 1fr)`,
                    ...state.selectedPieceIndex === i ? {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      "--xt": `calc(${pointer.pos[0]}px - ${getOffsetFromPiece(piece, pointer.type)[0]} * var(--square-size))`,
                      "--yt": `calc(${pointer.pos[1]}px - ${getOffsetFromPiece(piece, pointer.type)[1]} * var(--square-size))`,
                      transform: `
                        translate(var(--xt), var(--yt))
                        scale(1)`,
                      pointerEvents: "none",
                      touchAction: "none",
                      opacity: fit ? 0.5 : 1
                      // opacity: 0.5
                    } : {
                      "--square-size--units": "var(--square-shrink-size-units)"
                    },
                  }}
                >
                  {piece.map((rows, j) => (
                    <>
                      {rows.map((fill, k) => (
                        <Square
                          key={`${j},${k}`}
                          square={fill === 1 ? { hue: 100 } : null}
                        />
                      ))}
                    </>
                  ))}
              </div>
            </div>)}
          </div>
        </main>
      </div>
    </div>
  )
}

function tryGetPieceFromState(state: IState): [IPiece, number] | [null, null] {
  const selectedPieceIndex = state.selectedPieceIndex
  if(selectedPieceIndex === null) return [null, null]
  const selectedPiece = state.userPieces[selectedPieceIndex]
  if(!selectedPiece) return [null, null]
  return [selectedPiece, selectedPieceIndex]
}

const getOffsetFromPiece: (p: IPiece, pointerType: string) => [number, number] = (p, pt) => ([
  getPieceWidth(p) / 2,
  getPieceHeight(p) + (pt === "mouse" ? 0 : 2)
])

const getOffsetFromPieceInPixels: (p: IPiece, pointerType: string) => [number, number] = (p, pt) =>
  getOffsetFromPiece(p, pt).map(v => v * getSquareSizePixels()) as [number, number]

const getInitialState: () => IState = () => ({
  highscore: Number(window.localStorage.getItem(highscoreLocalStorageKey)) ?? 0,
  board: createEmptyBoard(boardSize),
  userPieces: getNewPieces(),
  selectedPieceIndex: null,
  score: 0
})

function snapPositionToBoard(boardRef: RefObject<HTMLDivElement>, pageX: number, pageY: number) {
  if (!boardRef.current) {
    throw Error("Cannot snap position when board does not exist")
  }
  const { width, height, x, y } = boardRef.current.getBoundingClientRect()

  const pointerXRelative = pageX - x
  const pointerYRelative = pageY - y

  const { colIndex, rowIndex } = mapRelativePositionToIndices({ width, height, pointerXRelative, pointerYRelative, boardSize })
  return { colIndex, rowIndex }
}

function getNewPieces() {
  // return [
  //   pieces[12],
  //   pieces[12],
  //   pieces[12],
  // ]
  const newPieces: IPiece[] = []

  for (let i = 0; i < 3; i++) {
    newPieces.push(pieces[Math.floor(Math.random() * pieces.length)])
  }
  return newPieces
}
