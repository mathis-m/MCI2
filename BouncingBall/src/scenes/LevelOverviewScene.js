import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import {allLevels} from "../levels/allLevels";
import {persistService} from "../persistService";

export class LevelOverviewScene extends Phaser.Scene {
    constructor() {
        super('levelOverview');
    }

    preload() {
        this.wins = persistService.getPersistedWins();
        this.previews = persistService.getPersistedPreviews();

        for (const level of allLevels) {
            const win = this.wins.find(w => w.levelKey === level.key);
            const preview = this.previews.find(w => w.levelKey === level.key);
            let imageBase64 = undefined;
            if(win) {
                imageBase64 = win.imageBase64;
            } else if (preview) {
                imageBase64 = preview.imageBase64;
            }
            const key = 'preview_' + level.name;
            if(this.textures.exists(key)) {
                this.textures.removeKey(key);
            }
            if(imageBase64 === undefined) {
                continue;
            }
            this.textures.addBase64(key, imageBase64);
        }
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        const midX = WorldWidth / 2;

        const title = this.add
            .text(
                midX,
                10,
                "Levels",
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '40px',
                    color: '#fff',
                }
            )
            .setOrigin(0.5, 0);
        this.track = this.add.rectangle(0,0,20,10, 0x6D6D6D)//.setVisible(true);
        this.thumb = this.add.rectangle(0,0,10,100, 0xFFFFFF)//.setVisible(true);
        this.load.once('loaderror', (fileObj) => {
            debugger;
        });

        this.setupScroll(midX, title);
    }

    setupScroll(midX, title) {
        this.isSetup = true
        this.scrollablePanel = this.rexUI.add.scrollablePanel({
            x: midX,
            y: ((WorldHeight - (title.y + title.height + 30)) / 2) + (title.y + title.height + 30),
            width: WorldWidth - 100,
            height: WorldHeight - (title.y + title.height + 30),
            scrollMode: 0,
            panel: {
                child: this.createGrid(),
                mask: {
                    mask: true,
                    padding: 1,
                }
            },

            slider: {
                track: this.track,
                thumb: this.thumb
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
                header: 10,
                footer: 10,
            }
        }).layout()
            .setChildrenInteractive()
            .on('child.click', child => {
                const level = allLevels.find(l => l.name === child.text);
                this.scene.start('game', {level})
            })
    }

    createGrid() {
        this.wins = persistService.getPersistedWins();
        // Create table body
        const sizer = this.rexUI.add.fixWidthSizer({
            space: {
                left: 3,
                right: 3,
                top: 3,
                bottom: 3,
                item: 8,
                line: 8,
            },
        });

        for (const level of allLevels) {
            const win = this.wins.find(w => w.levelKey === level.key);
            const preview = this.previews.find(w => w.levelKey === level.key);
            let background;
            const height = WorldHeight / 3.5;
            if(win || preview) {
                const key = 'preview_' + level.name;
                const image = this.add.sprite(0, 0, key)
                    .setOrigin(0.5, 0);
                const scaleFactor = height / image.height;
                image.setSize(image.width * scaleFactor, image.height * scaleFactor);
                background = image
            } else {
                background = this.add.rectangle(0, 0 ,(WorldWidth -180) / 3, height, 0x474747);
            }
            const item = this.rexUI.add.label({
                width: background.width || (WorldWidth -180) / 3, height: background.height,
                background: background,
                text: this.add.text(0, 0, level.name, {
                    fontSize: "30px",
                    color: "#fff",
                    fontStyle: "bold"
                }),
                align: 'center',
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                }
            })
            sizer.add(item);
        }

        return sizer;
    }

    update(time, delta) {
        if(this.scrollablePanel && this.scrollablePanel.isOverflow && !this.thumb.visible) {
            //this.thumb.setVisible(true)
        }
        if(this.scrollablePanel && this.scrollablePanel.isOverflow && !this.track.visible) {
            //this.track.setVisible(true)
        }
    }
}