import Phaser from 'phaser';
import {GameScene} from "./scenes/GameScene";
import {WorldHeight, WorldWidth} from "./world";


export const config = {
    type: Phaser.AUTO,
    parent: 'bouncing-ball',
    width: WorldWidth,
    height: WorldHeight,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: GameScene,//[IntroScene, GameScene],
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
            gravity: {
                y: 2
            },
            debug: true
        }
    },
};