import { useState } from 'react'

export const FullscreenButton = () => {
    const [fullscreen, setFullscreen] = useState<Boolean>(document.fullscreenElement !== null)
    return <button onClick={() => {
        fullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()
        setFullscreen(() => !fullscreen)
    }}>
        {fullscreen ? 'Window' : 'Fullscreen'}
    </button>
}
