import Phaser from 'phaser';
import {GameScene} from "./scenes/GameScene";
import {WorldHeight, WorldWidth} from "./world";
import {IntroScene} from "./scenes/IntroScene";
console.log(`Running in '${!process.env.NODE_ENV ? 'production' : process.env.NODE_ENV}' mode`);

let scene
if (process.env.NODE_ENV === 'development') {
    scene = GameScene;
} else {
    scene = [IntroScene, GameScene];
}
export const config = {
    type: Phaser.AUTO,
    parent: 'bouncing-ball',
    width: WorldWidth,
    height: WorldHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WorldWidth,
        height: WorldHeight,
    },
    scene: scene,
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
            gravity: {
                y: 2
            },
        }
    },
};