import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import {allLevels} from "../levels/allLevels";

export class IntroScene extends Phaser.Scene {

    constructor() {
        super('intro');
    }

    preload() {
    }

    create() {
        const midX = WorldWidth / 2;
        const midY = WorldHeight / 2;

        this.add
            .text(
                midX,
                WorldHeight * 0.25,
                'Bouncing Ball',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '40px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5);

        this.add
            .text(
                midX,
                midY,
                'Click here to start',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('game', allLevels[0]));
    }
}