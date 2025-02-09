import { Scene } from 'phaser'

interface SnakeSegment extends Phaser.GameObjects.Rectangle {
    nextSegment?: SnakeSegment;
}

export default class SnakeScene extends Scene {
    private snake: SnakeSegment[] = [];
    private food!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private direction: { x: number; y: number } = { x: 1, y: 0 };
    private moveTimer = 0;
    private readonly moveInterval = 100; // Snake speed (lower = faster)
    private readonly gridSize = 20;
    private gameOver = false;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SnakeScene' });
    }

    create() {
        // Reset all game state
        this.snake = [];
        this.gameOver = false;
        this.score = 0;
        this.moveTimer = 0;
        this.direction = { x: 1, y: 0 }; // Reset direction to move right

        this.cursors = this.input.keyboard!.createCursorKeys();

        // Create initial snake
        const startX = 200;
        const startY = 300;
        for (let i = 0; i < 3; i++) {
            const segment = this.add.rectangle(
                startX - (i * this.gridSize),
                startY,
                this.gridSize - 2,
                this.gridSize - 2,
                0x00ff00
            ) as SnakeSegment;

            if (this.snake.length > 0) {
                this.snake[this.snake.length - 1].nextSegment = segment;
            }
            this.snake.push(segment);
        }

        // Create food
        this.food = this.add.rectangle(0, 0, this.gridSize - 2, this.gridSize - 2, 0xff0000);
        this.placeFood();

        // Add score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff'
        });

        // Add restart instruction text
        this.add.text(16, 56, 'Press SPACE to restart when game is over', {
            fontSize: '16px',
            color: '#fff'
        });

        // Add restart handler
        this.input.keyboard!.on('keydown-SPACE', () => {
            if (this.gameOver) {
                this.scene.restart();
            }
        });
    }

    update(time: number) {
        if (this.gameOver) return;

        // Handle input
        if (this.cursors.left.isDown && this.direction.x !== 1) {
            this.direction = { x: -1, y: 0 };
        } else if (this.cursors.right.isDown && this.direction.x !== -1) {
            this.direction = { x: 1, y: 0 };
        } else if (this.cursors.up.isDown && this.direction.y !== 1) {
            this.direction = { x: 0, y: -1 };
        } else if (this.cursors.down.isDown && this.direction.y !== -1) {
            this.direction = { x: 0, y: 1 };
        }

        // Move snake
        if (time > this.moveTimer) {
            const head = this.snake[0];
            const newX = head.x + (this.direction.x * this.gridSize);
            const newY = head.y + (this.direction.y * this.gridSize);

            // Check collision with walls
            if (newX < 0 || newX >= 800 || newY < 0 || newY >= 600) {
                this.gameOver = true;
                return;
            }

            // Check collision with self
            for (let i = 1; i < this.snake.length; i++) {
                if (newX === this.snake[i].x && newY === this.snake[i].y) {
                    this.gameOver = true;
                    return;
                }
            }

            // Move snake
            let prevX = head.x;
            let prevY = head.y;
            head.x = newX;
            head.y = newY;

            for (let i = 1; i < this.snake.length; i++) {
                const segment = this.snake[i];
                const tempX = segment.x;
                const tempY = segment.y;
                segment.x = prevX;
                segment.y = prevY;
                prevX = tempX;
                prevY = tempY;
            }

            // Check food collision
            if (head.x === this.food.x && head.y === this.food.y) {
                this.growSnake();
                this.placeFood();
                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);
            }

            this.moveTimer = time + this.moveInterval;
        }
    }

    private placeFood() {
        const gridX = Math.floor(800 / this.gridSize);
        const gridY = Math.floor(600 / this.gridSize);

        let validPosition = false;
        let x, y;

        while (!validPosition) {
            x = Phaser.Math.Between(0, gridX - 1) * this.gridSize;
            y = Phaser.Math.Between(0, gridY - 1) * this.gridSize;

            validPosition = true;
            for (const segment of this.snake) {
                if (segment.x === x && segment.y === y) {
                    validPosition = false;
                    break;
                }
            }
        }

        this.food.x = x!;
        this.food.y = y!;
    }

    private growSnake() {
        const lastSegment = this.snake[this.snake.length - 1];
        const newSegment = this.add.rectangle(
            lastSegment.x,
            lastSegment.y,
            this.gridSize - 2,
            this.gridSize - 2,
            0x00ff00
        ) as SnakeSegment;

        lastSegment.nextSegment = newSegment;
        this.snake.push(newSegment);
    }
} 