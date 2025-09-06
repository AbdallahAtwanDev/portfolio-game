import Phaser from 'phaser'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js'

interface Project {
  name: string
  color: number
  x: number
  y: number
  link: string
}

export default class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 200
  private joystick!: VirtualJoystick
  private jumpButton?: Phaser.GameObjects.Arc
  private canJump = true
  private backgrounds: Phaser.GameObjects.TileSprite[] = []
  private projects: Project[] = []
  private projectPlatforms: Phaser.Physics.Arcade.StaticGroup | undefined
  private popup!: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'PlayScene' })
  }

  preload(): void {
    // -------------------
    // تحميل الصور والـ sprites
    // -------------------
    this.load.image('layer1', '/assets/backgrounds/layer1-stars.png')
    this.load.image('layer2', '/assets/backgrounds/layer2-nebula.png')
    this.load.image('layer3', '/assets/backgrounds/layer3-galaxies.png')
    this.load.image('ground', '/assets/backgrounds/ground.png')
    this.load.spritesheet('player', '/assets/sprites/player-sprite.png', {
      frameWidth: 216,
      frameHeight: 582
    })
  }

  create(): void {
    const { width, height } = this.scale

    // -------------------
    // الخلفيات Parallax
    // -------------------
    this.backgrounds.push(
      this.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0).setScrollFactor(0),
      this.add.tileSprite(0, 0, width, height, 'layer2').setOrigin(0).setScrollFactor(0),
      this.add.tileSprite(0, 0, width, height, 'layer3').setOrigin(0).setScrollFactor(0)
    )

    // -------------------
    // الأرضية
    // -------------------
    const ground = this.physics.add.staticImage(width / 2, height - 20, 'ground')
    ground.setOrigin(0.5, 1)
    ground.setScale(width / ground.width, 0.4)
    ground.refreshBody()

    // -------------------
    // إعداد اللاعب
    // -------------------
    this.player = this.physics.add.sprite(width / 2, height - 150, 'player')
    this.player.setScale(0.3)
    this.player.setCollideWorldBounds(true)
    this.player.setGravityY(1000)
    this.physics.add.collider(this.player, ground, () => (this.canJump = true))

    // -------------------
    // الأنيميشن
    // -------------------
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
    this.anims.create({ key: 'idle', frames: [{ key: 'player', frame: 0 }], frameRate: 1 })
    this.anims.create({ key: 'jump', frames: [{ key: 'player', frame: 2 }], frameRate: 1 })

    // -------------------
    // التحكم بالكيبورد
    // -------------------
    this.cursors = this.input.keyboard.createCursorKeys()

    // -------------------
    // التحكم بالموبايل
    // -------------------
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (window.innerWidth <= 1024 || isTouch) {
      this.joystick = new VirtualJoystick(this, {
        x: 120,
        y: height - 120,
        radius: 50,
        base: this.add.circle(0, 0, 50, 0x6666ff, 0.3),
        thumb: this.add.circle(0, 0, 25, 0xffffff, 0.8)
      })
      this.input.addPointer(1)

      this.jumpButton = this.add
        .circle(width - 100, height - 100, 40, 0xff6666, 0.5)
        .setInteractive()
        .on('pointerdown', () => this.jump())
    }

    // -------------------
    // إعداد منصات المشاريع
    // -------------------
    this.projects = [
      { name: 'Project 1', color: 0xff5555, x: 200, y: height - 150, link: 'https://github.com/project1' },
      { name: 'Project 2', color: 0x55ff55, x: 500, y: height - 250, link: 'https://github.com/project2' },
      { name: 'Project 3', color: 0x5555ff, x: 800, y: height - 350, link: 'https://github.com/project3' }
    ]

    this.projectPlatforms = this.physics.add.staticGroup()
    this.projects.forEach((proj) => {
      const plat = this.add.rectangle(proj.x, proj.y, 150, 20, proj.color)
      this.projectPlatforms!.add(plat)
    })

    // -------------------
    // Collider بين اللاعب والمنصات
    // -------------------
    this.physics.add.collider(this.player, this.projectPlatforms!, (player, platform) => {
      const proj = this.projects.find(
        (p) => Math.abs(p.x - platform.x) < 10 && Math.abs(p.y - platform.y) < 10
      )
      if (proj) this.showPopup(proj)
    })

    // -------------------
    // Popup للمشاريع
    // -------------------
    this.popup = this.add.container(0, 0)
    this.popup.setVisible(false)
  }

  update(): void {
    // -------------------
    // حركة اللاعب
    // -------------------
    this.player.setVelocityX(0)
    if (this.cursors.left?.isDown) this.movePlayer('left')
    else if (this.cursors.right?.isDown) this.movePlayer('right')
    else this.stopPlayer()
    if (this.cursors.up?.isDown) this.jump()

    if (this.joystick) {
      const fx = this.joystick.forceX
      if (fx < -10) this.movePlayer('left')
      else if (fx > 10) this.movePlayer('right')
    }

    // -------------------
    // Parallax الخلفيات
    // -------------------
    this.backgrounds[0].tilePositionX += 0.1
    this.backgrounds[1].tilePositionX += 0.3
    this.backgrounds[2].tilePositionX += 0.5
  }

  private movePlayer(dir: 'left' | 'right') {
    const vel = dir === 'left' ? -this.speed : this.speed
    this.player.setVelocityX(vel)
    this.player.anims.play(dir === 'left' ? 'walk-left' : 'walk-right', true)
    this.player.setFlipX(dir === 'left')
  }

  private stopPlayer() {
    this.player.setVelocityX(0)
    this.player.anims.play('idle', true)
  }

  private jump() {
    if (!this.canJump) return
    this.player.setVelocityY(-500)
    this.player.anims.play('jump', true)
    this.canJump = false
  }

  private showPopup(proj: Project) {
    this.popup.removeAll(true)
    const rect = this.add.rectangle(proj.x, proj.y - 80, 180, 100, 0x000000, 0.7)
    const text = this.add.text(proj.x - 80, proj.y - 110, proj.name, { fontSize: '16px', color: '#fff' })
    const link = this.add.text(proj.x - 70, proj.y - 90, 'Visit', { fontSize: '14px', color: '#00f' })
      .setInteractive()
      .on('pointerdown', () => window.open(proj.link, '_blank'))
    this.popup.add([rect, text, link])
    this.popup.setVisible(true)
  }
}
