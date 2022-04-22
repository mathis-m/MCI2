import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import {allLevels, getNextLevel} from "../levels/allLevels";

export class LevelRunFinishScene extends Phaser.Scene {
    constructor() {
        super('levelRunFinish');
        this.nextLevel = null;
    }

    init({
        isWin,
        score,
        levelKey,
        winImage
    }) {
        this.isWin = isWin;
        this.winImage = winImage
        this.score = isWin ? score : score || 0;
        const levelInfo = allLevels.find(x => x.key === levelKey);
        this.levelInfo = levelInfo;
        this.levelName = levelInfo.name
        this.nextLevel = getNextLevel(this.levelInfo.key);
        this.curLevel = allLevels[this.levelInfo.key];
    }

    preload() {
    }

    create() {
        const midX = WorldWidth / 2;
        const midY = WorldHeight / 2;

        const isLastLevel = this.nextLevel === null;

        const title = this.add
            .text(
                midX,
                50,
                this.isWin
                    ? isLastLevel
                        ? "Game Completed"
                        : this.levelName + " Completed"
                    : this.levelName + " Failed",
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '40px',
                    color: '#fff',
                }
            )
            .setOrigin(0.5, 0);

        const repeat = this.add
            .text(
                midX,
                title.y + title.height + 20,
                "Play again",
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    color: '#fff',
                }
            )
            .setOrigin(0.5, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('game', this.curLevel)
            });
        const nextOrOverview = this.add
            .text(
                midX,
                repeat.y + repeat.height + 20,
                isLastLevel
                    ? "Back to overview"
                    : "Next level",
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    color: '#fff',
                }
            )
            .setOrigin(0.5, 0)
            .setInteractive()
            .on('pointerdown', () => {
                if (isLastLevel) {
                    this.scene.start('levelOverview')
                } else {
                    this.scene.start('game', this.nextLevel)
                }
            });

        let lastText = nextOrOverview

        if (!isLastLevel) {
            lastText = this.add
                .text(
                    midX,
                    nextOrOverview.y + nextOrOverview.height + 20,
                    "Back to overview",
                    {
                        fontFamily: 'Monaco, Courier, monospace',
                        fontSize: '20px',
                        color: '#fff',
                    }
                )
                .setOrigin(0.5, 0)
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('levelOverview')
                });
        }

        if(this.isWin && this.winImage !== null) {

            const key = 'win_' + this.levelName + Date.now();
            this.textures.addImage(key, this.winImage);
            const image = this.add.sprite(midX, lastText.y + lastText.height + 50, key)
                .setOrigin(0.5, 0)
            const height = image.height;
            const maxHeight = WorldHeight -(lastText.y + lastText.height + 100);
            const scaleFactor = maxHeight / height;
            image.setScale(scaleFactor);

            const boarder = this.add.graphics();
            boarder.lineStyle(3, 0xFFFFFF)
            boarder.strokeRectShape(image.getBounds())
        }
    }
}