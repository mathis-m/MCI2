import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import {allLevels} from "../levels/allLevels";
import {snapshot} from "../index";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super('intro');
        this.snapshotGame = snapshot;
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
            .on('pointerdown', () => this.scene.start('levelOverview'))
        debugger;
        const snapshotLevel = (i) => {
            if(i === allLevels.length)
                return;
            this.snapshotGame.scene.start('game', {
                level: allLevels[i], isPreview: true, destroyAfterSnapshot: i + 1 === allLevels.length,
                afterSnapshot: () => snapshotLevel(i + 1)
            });
        }

        snapshotLevel(0);
    }
}