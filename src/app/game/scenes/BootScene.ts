import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // -------- Player --------
    this.load.spritesheet('player', '/assets/sprites/player-sprite.png', {
      frameWidth: 216,
      frameHeight: 582
    });

    // -------- Ground --------
    this.load.image('ground', '/assets/backgrounds/ground.png');
  }

  create() {
    this.scene.start('PlayScene');
  }
}
