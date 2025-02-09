import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Phaser from 'phaser'
import { staticGames } from '../games/static/registry'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { gameType, gameId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        async function initGame() {
            if (!containerRef.current) {
                if (isMounted) {
                    setError('Failed to initialize game container')
                    setLoading(false)
                }
                return
            }

            if (!document.createElement('canvas').getContext('webgl')) {
                if (isMounted) {
                    setError('Your browser does not support WebGL')
                    setLoading(false)
                }
                return
            }

            if (gameType === 'static' || gameType === 'generated') {
                try {
                    if (gameRef.current) {
                        gameRef.current.destroy(true)
                        gameRef.current = null
                    }

                    containerRef.current.innerHTML = ''

                    const gameModule = await import(`../games/static/${gameId}/Scene`)

                    if (!isMounted || !containerRef.current) return

                    gameRef.current = new Phaser.Game({
                        ...gameModule.config,
                        scale: {
                            mode: Phaser.Scale.FIT,
                            autoCenter: Phaser.Scale.CENTER_BOTH,
                            width: gameModule.config.width || 800,
                            height: gameModule.config.height || 600,
                            parent: containerRef.current
                        },
                        parent: containerRef.current
                    })

                    if (isMounted) {
                        setLoading(false)
                    }
                } catch (err) {
                    if (isMounted) {
                        setError('Failed to load game')
                        setLoading(false)
                    }
                }
            } else {
                if (isMounted) {
                    setError('Unsupported game type')
                    setLoading(false)
                }
            }
        }

        initGame()

        return () => {
            isMounted = false

            if (gameRef.current) {
                gameRef.current.destroy(true, false)
                gameRef.current = null
            }

            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [gameType, gameId])

    return (
        <div className="game-wrapper">
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                }}>
                    Loading game...
                </div>
            )}
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                }}>
                    Error: {error}
                </div>
            )}
            <div
                id="game-container"
                ref={containerRef}
                style={{
                    width: '800px',
                    height: '600px',
                    position: 'relative',
                    opacity: loading || error ? 0 : 1,
                    visibility: loading || error ? 'hidden' : 'visible'
                }}
            />
        </div>
    )
}

export default GameContainer 