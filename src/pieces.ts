const notRotatedPieces = [
  [
    [1]
  ],
  [
    [1,1],
    [1,1]
  ],
  [
    [1,1,1],
    [1,1,1],
    [1,1,1]
  ],
]
const symmetricPiecesTwoRotations = [
  [
    [1,1]
  ],
  [
    [1,1,1]
  ],
  [
    [1,1,1,1]
  ],
  [
    [1,1,1,1,1]
  ],
  [
    [1,1,1,1,1,1]
  ],

  [
    [1,1,1],
    [1,1,1]
  ],
  [
    [1,1,1,1],
    [1,1,1,1],
    [1,1,1,1]
  ],
  [
    [1,1,0],
    [0,1,1],
  ],
]

const fourTimesRotated = [
  [
    [1,0],
    [1,1],
  ],
  [
    [1,0,0],
    [1,0,0],
    [1,1,1],
  ],
  [
    [0,1,0],
    [1,1,1],
  ],
]

const assymetricPiecesFourTimesRotated = [
  [
    [1,0,0],
    [1,1,1],
  ],
  [
    [1,0,0,0],
    [1,1,1,1],
  ]
]

const rotatedNTimes = (rotates: number) => (piece: number[][]) => {
  const result = []
  for (let i = 0; i < rotates; i++) {
    const newPiece = rotate(piece)
    result.push(newPiece)
    piece = newPiece
  }
  return result
}

const flatten = <T>(array: T[][]) => array.reduce((prev: T[], current: T[]) => ([...prev, ...current]), [] as T[])

export const pieces = [
  ...notRotatedPieces,
  ...flatten(symmetricPiecesTwoRotations.map(rotatedNTimes(2))),
  ...flatten(fourTimesRotated.map(rotatedNTimes(4))),
  ...flatten(assymetricPiecesFourTimesRotated.map(rotatedNTimes(4))),
  ...flatten(assymetricPiecesFourTimesRotated
      .map(pcs => pcs.slice().reverse())
      .map(rotatedNTimes(4))
  )
]

function rotate(piece: number[][]) {
  const numOfRows = piece.length
  const numOfCols = piece[0].length
  const newNumOfRows = numOfCols
  const newNumOfCols = numOfRows
  const newRows = []

  for (let i = 0; i < newNumOfRows; i++) {
    const row = []

    for (let ii = 0; ii < newNumOfCols; ii++) {
      const rowIndex = newNumOfCols - ii - 1;
      const colIndex = i;
      row.push(piece[rowIndex][colIndex])
    }
    newRows.push(row)
  }
  return newRows
}
