import Phaser from 'phaser'

export default class CollectStarsScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'CollectStarsScene' })
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png')
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png')
        this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png')
        this.load.spritesheet('dude',
            'https://labs.phaser.io/assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )
    }

    create() {
        this.add.image(400, 300, 'sky')

        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()
        this.platforms.create(600, 400, 'ground')
        this.platforms.create(50, 250, 'ground')
        this.platforms.create(750, 220, 'ground')

        this.player = this.physics.add.sprite(100, 450, 'dude')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        this.stars.children.iterate((child) => {
            const star = child as Phaser.Physics.Arcade.Image
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.stars, this.platforms)
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this)

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#fff' })
    }

    update() {
        if (!this.player) return

        const cursors = this.input.keyboard.createCursorKeys()

        if (cursors.left.isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play('left', true)
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }

    private collectStar(player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
        const starSprite = star as Phaser.Physics.Arcade.Image
        starSprite.disableBody(true, true)

        this.score += 10
        this.scoreText?.setText('Score: ' + this.score)
    }
} 