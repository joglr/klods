const rootStyles = process.env.NODE_ENV !== "test" ? getComputedStyle(document.documentElement) : {
  values: {
    "--board-size": "8",
    "--square-size-units": "3.5"
  },
  getPropertyValue(prop: keyof typeof this.values) {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("getComputedStyle fallback only meant for testing");
    }
    return this.values[prop];
  }
};
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

export const undos = 3