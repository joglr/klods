import { useEffect } from "react"

export function usePointerExit(handler: () => void) {
  useEffect(() => {
    window.addEventListener("pointerup", handler)
    window.addEventListener("pointercancel", handler)
    window.addEventListener("pointerleave", handler)
    return () => {
      window.removeEventListener("pointerup", handler)
      window.removeEventListener("pointercancel", handler)
      window.removeEventListener("pointerleave", handler)
    }
  }, [handler])
}
