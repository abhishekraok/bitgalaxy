
import 'phaser';

class MainScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cookies!: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gameOver: boolean = false;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload(): void {
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
        this.load.image('cookie', 'https://labs.phaser.io/assets/sprites/star.png');
    }

    create(): void {
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);

        this.cookies = this.physics.add.group();

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff'
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnCookie,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(
            this.player,
            this.cookies,
            this.collectCookie,
            undefined,
            this
        );
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

    private spawnCookie(): void {
        const x = Phaser.Math.Between(0, 800);
        const cookie = this.cookies.create(x, 0, 'cookie') as Phaser.Physics.Arcade.Sprite;
        cookie.setVelocityY(200);
    }

    private collectCookie(player: Phaser.GameObjects.GameObject, cookie: Phaser.GameObjects.GameObject): void {
        const cookieSprite = cookie as Phaser.Physics.Arcade.Sprite;
        cookieSprite.destroy();

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
    backgroundColor: '#000000'
};

export { MainScene as default, config };
