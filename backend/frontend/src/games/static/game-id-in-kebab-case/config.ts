import { GameConfig } from 'phaser'
import GameIdInKebabCaseScene from './GameIdInKebabCaseScene'

const config: GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4488aa',
    parent: 'game-container',
    scene: GameIdInKebabCaseScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

export { config as default }
