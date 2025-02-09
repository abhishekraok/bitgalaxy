```typescript
import 'phaser';

class MainScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private apples!: Phaser.Physics.Arcade.Group;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gameOver: boolean = false;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload(): void {
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
        this.load.image('apple', 'https://labs.phaser.io/assets/sprites/apple.png');
    }

    create(): void {
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);

        this.apples = this.physics.add.group();
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            color: '#fff' 
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnApple,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(
            this.player,
            this.apples,
            this.collectApple,
            undefined,
            this
        );
    }

    update(): void {
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }
    }

    private spawnApple(): void {
        const x = Phaser.Math.Between(0, 800);
        const apple = this.apples.create(x, 0, 'apple');
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
    scene: MainScene
};

new Phaser.Game(config);
```