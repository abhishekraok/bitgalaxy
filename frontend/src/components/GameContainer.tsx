import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Phaser from 'phaser'
import { staticGames } from '../games/static/registry'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { gameType, gameId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        async function initGame() {
            if (gameType === 'static') {
                const gameInfo = staticGames.find(g => g.id === gameId)
                if (!gameInfo) {
                    setError('Game not found')
                    setLoading(false)
                    return
                }

                try {
                    // Destroy any existing game instance
                    if (gameRef.current) {
                        gameRef.current.destroy(true)
                        gameRef.current = null
                    }

                    // Clear the container explicitly via the ref
                    if (containerRef.current) {
                        containerRef.current.innerHTML = ''
                    }

                    const configImport = await gameInfo.getConfig()
                    const gameConfig = configImport.default || configImport

                    // Ensure the component is still mounted before continuing
                    if (!isMounted) return

                    // Create new game instance using the container ref
                    gameRef.current = new Phaser.Game({
                        ...gameConfig,
                        parent: containerRef.current as HTMLElement,
                        scale: {
                            mode: Phaser.Scale.FIT,
                            autoCenter: Phaser.Scale.CENTER_BOTH,
                            width: 800,
                            height: 600,
                            parent: containerRef.current as HTMLElement,
                        },
                        type: Phaser.AUTO,
                        backgroundColor: '#000000',
                    })
                } catch (err) {
                    console.error('Failed to load game:', err)
                    setError('Failed to load game')
                    setLoading(false)
                    return
                }
            } else if (gameType === 'generated') {
                // For now, generated games are not implemented in this container.
                setError('Generated games are not supported yet.')
                setLoading(false)
                return
            } else {
                setError('Unsupported game type')
                setLoading(false)
                return
            }
            setLoading(false)
        }

        initGame()

        // Cleanup on unmount or dependency change
        return () => {
            isMounted = false
            if (gameRef.current) {
                gameRef.current.destroy(true)
                gameRef.current = null
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [gameType, gameId, navigate])

    if (loading) {
        return <div>Loading game...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="game-wrapper">
            <div id="game-container" ref={containerRef} style={{ backgroundColor: '#000' }} />
        </div>
    )
}

export default GameContainer 