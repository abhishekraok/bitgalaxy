import { GameConfig } from 'phaser'
import SnakeScene from './SnakeScene'

const config: GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game-container',
    scene: SnakeScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

export default config 