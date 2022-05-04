import Phaser from 'phaser';
import {GameScene} from "./scenes/GameScene";
import {WorldHeight, WorldWidth} from "./world";
import {IntroScene} from "./scenes/IntroScene";
import {LevelRunFinishScene} from "./scenes/LevelCompletedScene";
import {LevelOverviewScene} from "./scenes/LevelOverviewScene";
import {TutorialScene} from "./scenes/TutorialScene";
console.log(`Running in '${!process.env.NODE_ENV ? 'production' : process.env.NODE_ENV}' mode`);

let scene
if (process.env.NODE_ENV === 'development') {
    scene = [IntroScene, TutorialScene, GameScene, LevelRunFinishScene, LevelOverviewScene];
} else {
    scene = [IntroScene, TutorialScene, GameScene, LevelRunFinishScene, LevelOverviewScene];
}
export const config = {
    type: Phaser.CANVAS,
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
            positionIterations: 20,
            velocityIterations: 20,
            constraintIterations: 20,
            gravity: {
                y: 2
            },
        }
    },
};

export const snapshotConfig = {
    type: Phaser.CANVAS,
    width: WorldWidth,
    height: WorldHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WorldWidth,
        height: WorldHeight,
    },
    scene: GameScene,
    debug: false,
    physics: {
        default: 'matter',
        matter: {
            positionIterations: 20,
            velocityIterations: 20,
            constraintIterations: 20,
            gravity: {
                y: 2
            },
        }
    },
    dom: {
        createContainer: false
    },
    canvasStyle: "display: none"
};