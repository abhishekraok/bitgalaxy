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
                    navigate('/')
                    return
                }

                try {
                    // Clean up any existing game instance, and set to null
                    if (gameRef.current) {
                        gameRef.current.destroy(true)
                        gameRef.current = null
                    }

                    // Clear the container explicitly via the ref
                    if (containerRef.current) {
                        containerRef.current.innerHTML = ''
                    }

                    const config = await gameInfo.getConfig()
                    const gameConfig = config.default || config

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
                        }
                    })
                } catch (error) {
                    console.error('Failed to load game:', error)
                    setError('Failed to load game')
                    navigate('/')
                }
            }
            setLoading(false)
        }

        initGame()

        // Cleanup both the game and the container on unmount and on dependency change
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
            <div id="game-container" ref={containerRef} />
        </div>
    )
}

export default GameContainer 