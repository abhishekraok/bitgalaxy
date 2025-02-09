import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Phaser from 'phaser'
import { staticGames } from '../games/static/registry'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const { gameType, gameId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function initGame() {
            if (gameType === 'static') {
                const gameInfo = staticGames.find(g => g.id === gameId)
                if (!gameInfo) {
                    setError('Game not found')
                    navigate('/')
                    return
                }

                try {
                    // Clean up any existing game instance
                    if (gameRef.current) {
                        gameRef.current.destroy(true)
                    }

                    // Clear any existing game container
                    const container = document.getElementById('game-container')
                    if (container) {
                        container.innerHTML = ''
                    }

                    const config = await gameInfo.getConfig()
                    // Make sure we're using the default export
                    const gameConfig = config.default || config

                    // Create new game instance
                    gameRef.current = new Phaser.Game({
                        ...gameConfig,
                        parent: 'game-container'
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

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true)
            }
        }
    }, [gameType, gameId, navigate])

    if (loading) {
        return <div>Loading game...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return <div id="game-container" style={{ width: '800px', height: '600px', margin: '0 auto' }} />
}

export default GameContainer 