import Phaser from 'phaser'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js'

export default class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 200
private joystick!: VirtualJoystick

  // الخلفيات (parallax layers)
  private backgrounds: Phaser.GameObjects.TileSprite[] = []

  constructor() {
    super({ key: 'PlayScene' })
  }

  preload(): void {
    this.load.image('layer1', '/assets/backgrounds/layer1-stars.png')
    this.load.image('layer2', '/assets/backgrounds/layer2-nebula.png')
    this.load.image('layer3', '/assets/backgrounds/layer3-galaxies.png')
    // this.load.image('layer4', '/assets/backgrounds/layer4-planets.png')
    // this.load.image('layer5', '/assets/backgrounds/layer5-debris.png')
    this.load.spritesheet('player', '/assets/sprites/player-sprite.png', {
      frameWidth: 216,
      frameHeight: 582
    })
    this.load.image('ground', '/assets/sprites/ground.png')
  }

  create(): void {
    const { width, height } = this.scale

    // -----------------------
    // الخلفيات (Parallax Layers)
    // -----------------------
    this.backgrounds.push(
      this.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0).setScrollFactor(0),
      this.add.tileSprite(0, 0, width, height, 'layer2').setOrigin(0).setScrollFactor(0),
      this.add.tileSprite(0, 0, width, height, 'layer3').setOrigin(0).setScrollFactor(0),
      // this.add.tileSprite(0, 0, width, height, 'layer4').setOrigin(0).setScrollFactor(0),
      // this.add.tileSprite(0, 0, width, height, 'layer5').setOrigin(0).setScrollFactor(0)
    )

    // -----------------------
    // الأرضية
    // -----------------------
    const ground = this.physics.add.staticImage(width /2, height, 'ground')
    ground.setOrigin(0.5, 1)
    const scaleX = width / ground.width
    ground.setScale(scaleX, 0.3).refreshBody()

    // -----------------------
    // اللاعب
    // -----------------------
    this.player = this.physics.add.sprite(width / 2, height - ground.displayHeight, 'player')
    this.player.setScale(0.6)
    this.player.setCollideWorldBounds(true)

    this.physics.add.collider(this.player, ground)

    // -----------------------
    // الأنيمشن
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
    // الكيبورد
    // -----------------------
    this.cursors = this.input.keyboard.createCursorKeys()

    // -----------------------
    // أزرار الموبايل (يمين/شمال فقط)
    // -----------------------
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const showMobileButtons = window.innerWidth <= 1024 || isTouchDevice

    if (showMobileButtons) {
      this.joystick = new VirtualJoystick(this, {
        x: 120,
        y: this.scale.height - 120,
        radius: 50,
        base: this.add.circle(0, 0, 50, 0x6666ff, 0.3),
        thumb: this.add.circle(0, 0, 25, 0xffffff, 0.8)
      })

      this.input.addPointer(1)
    }
  }

  update(): void {
    if (!this.player) return

    this.player.setVelocityX(0)

    let moving = false

    // كيبورد
    if (this.cursors.left?.isDown) {
      this.movePlayer('left')
      moving = true
    } else if (this.cursors.right?.isDown) {
      this.movePlayer('right')
      moving = true
    }

    // Joystick (موبايل)
    if (this.joystick) {
      const forceX = this.joystick.forceX

      if (forceX < -10) {
        this.movePlayer('left')
        moving = true
      } else if (forceX > 10) {
        this.movePlayer('right')
        moving = true
      }
    }

    if (!moving) {
      this.stopPlayer()
    }

    // تحريك الخلفية (Parallax)
    this.backgrounds[0].tilePositionX += 0.1
    this.backgrounds[1].tilePositionX += 0.3
    this.backgrounds[2].tilePositionX += 0.5
  }

  // -----------------------
  // دوال مساعدة
  // -----------------------
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
