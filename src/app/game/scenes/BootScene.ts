import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // تحميل الـ sprite sheet
    this.load.spritesheet('player', '/assets/sprites/player-sprite.png', {
  frameWidth: 216,
  frameHeight: 582
    });
  }

  create() {
    this.scene.start('PlayScene');
  }
}
