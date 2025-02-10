
import 'phaser';

class MainScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private apples!: Phaser.Physics.Arcade.Group;
    private scoreText!: Phaser.GameObjects.Text;
    private score: number = 0;
    private gameOver: boolean = false;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload(): void {
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/basket.png');
        this.load.image('apple', 'https://labs.phaser.io/assets/sprites/apple.png');
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky1.png');
    }

    create(): void {
        this.add.image(400, 300, 'sky');

        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);

        this.apples = this.physics.add.group();

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff'
        });

        this.physics.add.overlap(
            this.player,
            this.apples,
            this.collectApple,
            undefined,
            this
        );

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnApple,
            callbackScope: this,
            loop: true
        });
    }

    update(): void {
        if (this.gameOver) {
            return;
        }

        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }
    }

    private spawnApple(): void {
        const x = Phaser.Math.Between(0, 800);
        const apple = this.apples.create(x, 0, 'apple');
        apple.setBounce(0);
        apple.setVelocityY(200);
    }

    private collectApple(player: Phaser.GameObjects.GameObject, apple: Phaser.GameObjects.GameObject): void {
        const appleSprite = apple as Phaser.Physics.Arcade.Sprite;
        appleSprite.destroy();
        
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MainScene,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

export { MainScene as default, config };
