import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Phaser from 'phaser'
import { staticGames } from '../games/static/registry'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const { gameType, gameId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function initGame() {
            if (gameType === 'static') {
                const gameInfo = staticGames.find(g => g.id === gameId)
                if (!gameInfo) {
                    navigate('/')
                    return
                }

                try {
                    const { default: config } = await gameInfo.getConfig()
                    gameRef.current = new Phaser.Game(config)
                } catch (error) {
                    console.error('Failed to load game:', error)
                    navigate('/')
                }
            }
            setLoading(false)
        }

        initGame()

        return () => {
            gameRef.current?.destroy(true)
        }
    }, [gameType, gameId, navigate])

    if (loading) {
        return <div>Loading game...</div>
    }

    return <div id="game-container" />
}

export default GameContainer 