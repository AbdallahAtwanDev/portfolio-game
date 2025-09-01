import Phaser from 'phaser'

export default class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 200
  private collectibles!: Phaser.Physics.Arcade.Group
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private health = 3
  private healthText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'PlayScene' })
  }

  create() {
    // -----------------------
    // الخلفية
    // -----------------------
    this.add.image(512, 512, 'background').setScale(1).setOrigin(0.5)

    // -----------------------
    // الشخصية
    // -----------------------
    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.setScale(0.5)
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 7 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 10 }),
      frameRate: 8,
      repeat: -1
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    // -----------------------
    // الجدران / الحواجز
    // -----------------------
    // const walls = this.physics.add.staticGroup()
    // walls.create(200, 400, 'wall')
    // walls.create(600, 400, 'wall')
    // this.physics.add.collider(this.player, walls)

    // -----------------------
    // Collectibles
    // -----------------------
    // this.collectibles = this.physics.add.group({
    //   key: 'coin',
    //   repeat: 5,
    //   setXY: { x: 100, y: 100, stepX: 150 }
    // })
    // this.physics.add.overlap(this.player, this.collectibles, this.collectCoin, undefined, this)

    // -----------------------
    // Score + Health
    // -----------------------
    // this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', color: '#fff' })
    // this.healthText = this.add.text(16, 50, 'Health: 3', { fontSize: '24px', color: '#fff' })

    // -----------------------
    // أعداء
    // -----------------------
    const enemy = this.physics.add.sprite(300, 300, 'enemy')
    enemy.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, enemy, this.hitEnemy, undefined, this)
  }

  update() {
  if (!this.player) return

  // إيقاف الحركة
  this.player.setVelocity(0)

  // حركة أفقية
  if (this.cursors.left?.isDown) {
    this.player.setVelocityX(-this.speed)
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'walk-left') {
      this.player.anims.play('walk-left', true)
    }
    this.player.setFlipX(true)
  } else if (this.cursors.right?.isDown) {
    this.player.setVelocityX(this.speed)
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'walk-right') {
      this.player.anims.play('walk-right', true)
    }
    this.player.setFlipX(false)
  }

  // حركة رأسية
  if (this.cursors.up?.isDown) {
    this.player.setVelocityY(-this.speed)
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'walk-up') {
      this.player.anims.play('walk-up', true)
    }
  } else if (this.cursors.down?.isDown) {
    this.player.setVelocityY(this.speed)
  
  }

  // لو مفيش حركة
  if (
    !this.cursors.left?.isDown &&
    !this.cursors.right?.isDown &&
    !this.cursors.up?.isDown 
  ) {
    this.player.setVelocity(0)
    this.player.anims.stop()
    this.player.setFrame(0)
  }
}

}
