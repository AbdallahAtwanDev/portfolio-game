import Phaser from 'phaser'

export default class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 200

  private leftButton?: Phaser.GameObjects.Rectangle
  private rightButton?: Phaser.GameObjects.Rectangle
  private moveLeft = false
  private moveRight = false

  constructor() {
    super({ key: 'PlayScene' })
  }

  create(): void {
    // -----------------------
    // الشخصية
    // -----------------------
    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.setScale(0.5)
    this.player.setCollideWorldBounds(true)

    // -----------------------
    // الرسوم المتحركة
    // -----------------------
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

    // -----------------------
    // تحكم الكيبورد
    // -----------------------
    this.cursors = (this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin).createCursorKeys()

    // -----------------------
    // أزرار الهاتف/تابلت
    // تظهر فقط إذا الشاشة ≤ 1024px أو الجهاز يدعم لمس
    // -----------------------
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const showMobileButtons = window.innerWidth <= 1024 || isTouchDevice

    if (showMobileButtons) {
      const buttonSize = 100
      const yPos = this.scale.height - buttonSize - 20

      // زر يسار
      this.leftButton = this.add.rectangle(80, yPos, buttonSize, buttonSize, 0x0000ff, 0.3)
        .setInteractive()
      this.setupButtonInteraction(this.leftButton, 'left')

      // زر يمين
      this.rightButton = this.add.rectangle(200, yPos, buttonSize, buttonSize, 0x00ff00, 0.3)
        .setInteractive()
      this.setupButtonInteraction(this.rightButton, 'right')
    }
  }

  update(): void {
    if (!this.player) return

    this.player.setVelocityX(0)

    // حركة أفقية بالكيبورد أو أزرار اللمس
    if (this.cursors.left?.isDown || this.moveLeft) {
      this.movePlayer('left')
    } else if (this.cursors.right?.isDown || this.moveRight) {
      this.movePlayer('right')
    } else {
      this.stopPlayer()
    }
  }

  // -----------------------
  // دوال مساعدة
  // -----------------------
  private setupButtonInteraction(button: Phaser.GameObjects.Rectangle, direction: 'left' | 'right'): void {
    button.on('pointerdown', () => direction === 'left' ? this.moveLeft = true : this.moveRight = true)
    button.on('pointerup', () => direction === 'left' ? this.moveLeft = false : this.moveRight = false)
    button.on('pointerout', () => direction === 'left' ? this.moveLeft = false : this.moveRight = false)
  }

  private movePlayer(direction: 'left' | 'right'): void {
    const velocity = direction === 'left' ? -this.speed : this.speed
    const animKey = direction === 'left' ? 'walk-left' : 'walk-right'
    const flipX = direction === 'left'

    this.player.setVelocityX(velocity)
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim?.key !== animKey) {
      this.player.anims.play(animKey, true)
    }
    this.player.setFlipX(flipX)
  }

  private stopPlayer(): void {
    this.player.setVelocityX(0)
    this.player.anims.stop()
    this.player.setFrame(0)
  }
}
