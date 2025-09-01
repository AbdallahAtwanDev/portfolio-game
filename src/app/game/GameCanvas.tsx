'use client';
import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import PlayScene from './scenes/PlayScene';

export default function GameCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: mountRef.current,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
      },
      scene: [BootScene, PlayScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={mountRef}></div>;
}
