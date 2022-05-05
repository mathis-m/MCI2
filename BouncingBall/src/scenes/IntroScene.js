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
        this.load.audio('backgroundMusic', 'https://raw.githubusercontent.com/mathis-m/MCI2/main/BouncingBall/src/assets/backgroundMusic.ogg');
        this.load.audio('click', 'https://raw.githubusercontent.com/mathis-m/MCI2/main/BouncingBall/src/assets/click.ogg');
    }

    create() {
        this.sound.add("backgroundMusic", {
            loop: true,
        })
        this.sound.add("click", {
            loop: true,
            volume: 0.5
        })
        this.sound.play("backgroundMusic", {
            volume: 0.5
        })
        const midX = WorldWidth / 2;
        const midY = WorldHeight / 2;

        const title = this.add
            .text(
                midX,
                100,
                'Bouncing Ball',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '40px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5, 0);

        const start = this.add
            .text(
                midX,
                title.y + title.height + 50,
                'Click here to start',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5, 0)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("click")
                this.scene.start('levelOverview');
            })


        const tutorial = this.add
            .text(
                midX,
                start.y + start.height + 50,
                'Start the tutorial',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5, 0)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("click")

                return this.scene.start('tutorial');
            })

        const loading = this.add
            .text(
                midX,
                tutorial.y + tutorial.height + 50,
                'Loading...',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(0.5, 0)

        const width = WorldWidth / 5;
        const loadingContainer = this.add.graphics();
        loadingContainer.lineStyle(3, 0xFFFFFF);
        const y = loading.y + loading.height + 50;
        loadingContainer.strokeRect(midX - (width / 2), y, width, 50)

        const barWidth = ((width - 8) / allLevels.length ) - 4
        let curX = (midX - (width / 2)) + 6
        const levelLoadingBars = [];
        for (let i = 0; i <  allLevels.length; i++) {
            levelLoadingBars.push(
                this.add.graphics()
                    .fillStyle(0xFFFFFF)
                    .fillRect(curX, y + 6, barWidth, 38)
                    .setVisible(false)
            )
            curX += barWidth + 4
        }



        const snapshotLevel = (i) => {
            if (i > 0) {
                levelLoadingBars[i -1].setVisible(true)
            }

            if (i === allLevels.length) {
                start.setVisible(true);
                tutorial.setVisible(true);
                loading.setText("Loaded");
                this.snapshotGame.destroy(true, true);
            }
            console.log("snapshot " + i)
            this.snapshotGame.scene.start('game', {
                level: allLevels[i], isPreview: true, destroyAfterSnapshot: i + 1 === allLevels.length,
                afterSnapshot: () => snapshotLevel(i + 1)
            });
        }

        snapshotLevel(0);
    }
}