
import 'phaser';

class MainScene extends Phaser.Scene {
    private snake: Phaser.GameObjects.Rectangle[];
    private apple: Phaser.GameObjects.Rectangle;
    private direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    private moveTime: number;
    private moveDelta: number;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private isGameOver: boolean;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'MainScene' });
        this.snake = [];
        this.moveTime = 0;
        this.moveDelta = 100;
        this.direction = 'RIGHT';
        this.score = 0;
        this.isGameOver = false;
    }

    create(): void {
        this.snake = [];
        this.score = 0;
        this.isGameOver = false;
        this.direction = 'RIGHT';

        for (let i = 0; i < 3; i++) {
            const segment = this.add.rectangle(100 - i * 16, 100, 15, 15, 0x00ff00);
            this.snake.push(segment);
        }

        this.apple = this.add.rectangle(0, 0, 15, 15, 0xff0000);
        this.repositionApple();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff'
        });
    }

    update(time: number): void {
        if (this.isGameOver) {
            if (this.cursors.space.isDown) {
                this.scene.restart();
            }
            return;
        }

        if (time >= this.moveTime) {
            this.moveSnake();
            this.moveTime = time + this.moveDelta;
        }

        if (this.cursors.left.isDown && this.direction !== 'RIGHT') {
            this.direction = 'LEFT';
        } else if (this.cursors.right.isDown && this.direction !== 'LEFT') {
            this.direction = 'RIGHT';
        } else if (this.cursors.up.isDown && this.direction !== 'DOWN') {
            this.direction = 'UP';
        } else if (this.cursors.down.isDown && this.direction !== 'UP') {
            this.direction = 'DOWN';
        }
    }

    private moveSnake(): void {
        const head = this.snake[0];
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case 'LEFT':
                newX -= 16;
                break;
            case 'RIGHT':
                newX += 16;
                break;
            case 'UP':
                newY -= 16;
                break;
            case 'DOWN':
                newY += 16;
                break;
        }

        if (this.checkCollision(newX, newY)) {
            this.gameOver();
            return;
        }

        const newSegment = this.add.rectangle(newX, newY, 15, 15, 0x00ff00);
        this.snake.unshift(newSegment);

        if (this.checkAppleCollision(newX, newY)) {
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
            this.repositionApple();
            this.moveDelta = Math.max(50, this.moveDelta - 1);
        } else {
            const tail = this.snake.pop();
            tail?.destroy();
        }
    }

    private checkCollision(x: number, y: number): boolean {
        if (x < 0 || x >= 800 || y < 0 || y >= 600) {
            return true;
        }

        for (let i = 1; i < this.snake.length; i++) {
            if (x === this.snake[i].x && y === this.snake[i].y) {
                return true;
            }
        }

        return false;
    }

    private checkAppleCollision(x: number, y: number): boolean {
        return x === this.apple.x && y === this.apple.y;
    }

    private repositionApple(): void {
        let valid = false;
        let x, y;

        while (!valid) {
            x = Math.floor(Math.random() * 49) * 16;
            y = Math.floor(Math.random() * 37) * 16;
            valid = !this.snake.some(segment => segment.x === x && segment.y === y);
        }

        this.apple.setPosition(x, y);
    }

    private gameOver(): void {
        this.isGameOver = true;
        this.add.text(400, 300, 'Game Over!\nPress SPACE to restart', {
            fontSize: '32px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

export { MainScene as default, config };
