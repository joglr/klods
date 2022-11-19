const rootStyles = getComputedStyle(document.documentElement)
/**
 * Width of a square in viewport height units
 */
export const squareSize = Number(rootStyles.getPropertyValue("--square-size-units"))
export const getSquareSizePixels = () => window.innerHeight * (squareSize / 100)
/**
 * Board size in amount of squares
 */
export const boardSize = Number(rootStyles.getPropertyValue("--board-size"))

export const hues = [
  0,
  60,
  120,
  180,
  300
]

export const highscoreLocalStorageKey = "KLODS_HIGHSCORE"
