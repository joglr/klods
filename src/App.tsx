import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { pieces } from './pieces'
import type { IBoard, IPiece, IState } from './model'
import { Square } from './components/Square'
import { checkIfPieceFitsAndUpdateBoard, clearFullRows, createEmptyBoard, generateFitTest, getPieceHeight, getPieceWidth, snapPositionToBoard, drawN, calculateLocationFromIndex, createRainbowBoard, checkIfPieceCanBePlaced } from './util'
import { boardSize, getSquareSizePixels, highscoreLocalStorageKey, hues } from './constants'
import { usePointerExit } from './hooks'

const INITIAL_UNDOSLEFT = 3

export default function App() {
  const [state, setState] = useState<IState>(getInitialState)
  const [prevState, setPrevState] = useState<IState>(state)
  const [undosLeft, setUndosLeft] = useState<number>(INITIAL_UNDOSLEFT)
  const [queue, setQueue] = useState<(IPiece | null)[] | null>(null)
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

  const { pieceCanBePlacedValues, gameOver } = useMemo(() => {
    const values = state.userPieces.map((p) =>
      !p ? false : checkIfPieceCanBePlaced(state.board, p)
    )
    const gameOver = values.every((v) => !v)
    return { pieceCanBePlacedValues: values, gameOver }
  }, [state.board, state.userPieces])

  const [fit, boardWithPreview] = useMemo<[boolean, IBoard]>(() => {
    if (gameOver) return [false, createRainbowBoard(boardSize)]
    const [selectedPiece] = tryGetPieceFromState(state)
    if (!selectedPiece) return [false, state.board]
    if (!boardRef.current) {
      throw Error("Cannot snap position when board does not exist")
    }
    const { width, height, x, y } = boardRef.current.getBoundingClientRect()
    const { colIndex, rowIndex } = snapPositionToBoard({ boardSize, width, height, x, y, pageX: mousePosWithOffset[0], pageY: mousePosWithOffset[1] })
    const [fit, board] = checkIfPieceFitsAndUpdateBoard(
      { board: state.board, piece: selectedPiece, squareLocation: [colIndex, rowIndex], boardSize }    )
    return [fit, fit ? board : state.board]
  }, [gameOver, mousePosWithOffset, state])

  const { rowsToClear, colsToClear } = useMemo<{
    boardWithClearedRows: IBoard
    rowsToClear: number[]
    colsToClear: number[]
  }>(() => {
    const { newBoard: boardWithClearedRows, rowsToClear, colsToClear } = fit
      ? clearFullRows(boardWithPreview, boardSize)
      : { newBoard: state.board, rowsToClear: [], colsToClear: [] }
    return { boardWithClearedRows, rowsToClear, colsToClear}
  }, [boardWithPreview, fit, state.board])

  useEffect(() => {
    const highscore = Math.max(state.highscore, state.score).toString()
    localStorage.setItem(highscoreLocalStorageKey, highscore)
  }, [state.score, state.highscore])

  const resetGame = () => {
    setState(prevState => ({
      ...getInitialState(),
      highscore: Math.max(prevState.highscore, prevState.score)
    }))
    setUndosLeft(INITIAL_UNDOSLEFT)
    setPrevState(getInitialState)
  }

  const undo = () => {
    // console.log(Object.is(prevState, state)) // This gives false..
    if(JSON.stringify(prevState) !== JSON.stringify(state)){
      setState(prevState)
      setQueue(state.userPieces)
      setUndosLeft(undosLeft - 1)
    }
  }

  const pointerUpHandler = useCallback(function pointerUpHandler() {
    if (!boardRef.current) return
    if (!fit) {
      setState(p => ({...p, selectedPieceIndex: null}))
      return
    }

    // const squareLocation: [number, number] = [0, 0]
    // const [shouldSucceed, newTest] = generateFitTest(state, squareLocation)

    const [selectedPiece, selectedPieceIndex] = tryGetPieceFromState(state)
    if (!selectedPiece) return

    const { newBoard, rowsAndColsCleared } = clearFullRows(boardWithPreview, boardSize)
    setState(prevState => {
      const userPieces = prevState.userPieces.map((piece, i) => i === selectedPieceIndex ? null : piece)
      return ({
        board: newBoard,
        userPieces: userPieces.every(p => p == null)
          ? getNewPieces(queue)
          : userPieces,
        selectedPieceIndex: null,
        score: prevState.score + rowsAndColsCleared * boardSize,
        highscore: prevState.highscore
      })
    })

    setQueue(null)

    // if (shouldSucceed !== fit) {
    //   prompt("red test", newTest)
    // }
  }, [boardWithPreview, fit, queue, state])

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
            <div className="button">Score: {state.score}</div>
            <div className="button">High Score: {state.highscore}</div>
          </div>
          {/* <button disabled={undosLeft <= 0} className='undo' onClick={undo}>
            Undo ({undosLeft})
          </button> */}
        </header>
        <main className="game">
          <div className="board-wrapper">
            <div
              className="board"
              ref={boardRef}
            >
              {boardWithPreview.map((square, i) =>
                {
                  const [colIndex, rowIndex] = calculateLocationFromIndex(i, boardSize)
                  const shouldBlink = rowsToClear.includes(rowIndex) || colsToClear.includes(colIndex)
                  return <Square key={i} square={square} blink={shouldBlink} hasTransition={gameOver} />
                }
              )}
            </div>
          </div>
          {gameOver ? (
            <div>
              <button onClick={resetGame}>New game</button>
            </div>
          ) : (
            <div className="user-pieces">
              {state.userPieces.map((piece, pieceIndex) => {
                if (piece === null) {
                  return <div key={pieceIndex} />
                }

                return (
                  <div
                    className="piece"
                    key={pieceIndex}
                    onPointerDown={(e) => {
                      // Prevent drag behaviour
                      e.preventDefault()
                      if (gameOver) return
                      setPrevState(state)
                      // Select the piece that was dragged from
                      setState((prevState) => ({
                        ...prevState,
                        selectedPieceIndex: pieceIndex,
                      }))
                      setPointer({
                        offset: [e.pageX, e.pageY],
                        pos: [e.pageX, e.pageY],
                        type: e.pointerType,
                      })
                    }}
                  >
                    <div
                      className={state.selectedPieceIndex === pieceIndex
                        ? "piece-grid selected"
                        : "piece-grid"
                      }
                      style={{
                        gridTemplateColumns: `repeat(${piece.squares[0].length}, 1fr)`,
                        gridTemplateRows: `repeat(${piece.squares.length}, 1fr)`,
                        ...(state.selectedPieceIndex === pieceIndex
                          ? {
                              "--xt": `calc(${pointer.pos[0]}px - ${
                                getOffsetFromPiece(piece, pointer.type)[0]
                              } * var(--square-size))`,
                              "--yt": `calc(${pointer.pos[1]}px - ${
                                getOffsetFromPiece(piece, pointer.type)[1]
                              } * var(--square-size))`,
                              opacity: fit ? 0 : 1,
                            }
                          : {}),
                      }}
                    >
                      {piece.squares.map((rows, j) => (
                        <>
                          {rows.map((fill, k) => (
                            <Square
                              key={`${j},${k}`}
                              square={
                                fill === 1
                                  ? pieceCanBePlacedValues[pieceIndex]
                                    ? { hue: piece.hue}
                                    : { hue: 0 }
                                  : null
                              }
                              hasTransition={true}
                            />
                          ))}
                        </>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
  getPieceHeight(p) + (pt === "mouse" ? 0 : 5)
])

const getOffsetFromPieceInPixels: (p: IPiece, pointerType: string) => [number, number] = (p, pt) =>
  getOffsetFromPiece(p, pt).map(v => v * getSquareSizePixels()) as [number, number]

const getInitialState: () => IState = () => ({
  highscore: Number(window.localStorage.getItem(highscoreLocalStorageKey)) ?? 0,
  board: createEmptyBoard(boardSize),
  userPieces: getNewPieces(null),
  selectedPieceIndex: null,
  score: 0
})

const getNewPieces = (_queue: (IPiece | null)[] | null) : (IPiece | null)[] => drawN(pieces, 3)
  .map(p => ({
    squares: p,
    hue: drawN(hues, 1)[0]
  }))
