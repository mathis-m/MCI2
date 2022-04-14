import Phaser from 'phaser';
import {GameScene} from "./scenes/GameScene";
import {WorldHeight, WorldWidth} from "./world";


const config = {
    type: Phaser.CANVAS,
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
            }
        }
    },
};

const game = new Phaser.Game(config);
