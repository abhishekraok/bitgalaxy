import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Phaser from 'phaser'
import { gameConfig } from '../games/static/collect-stars'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const { gameType, gameId } = useParams()

    useEffect(() => {
        if (gameType === 'static' && gameId === 'collect-stars') {
            gameRef.current = new Phaser.Game(gameConfig)
        }

        return () => {
            gameRef.current?.destroy(true)
        }
    }, [gameType, gameId])

    return <div id="game-container" />
}

export default GameContainer 