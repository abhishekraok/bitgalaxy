import { GameConfig } from 'phaser'
// Import your collect stars scene
import CollectStarsScene from './CollectStarsScene'

const config: GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: CollectStarsScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

export { config as default } 