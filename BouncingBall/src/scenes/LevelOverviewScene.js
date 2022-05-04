import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import {allLevels} from "../levels/allLevels";
import {persistService} from "../persistService";

export class LevelOverviewScene extends Phaser.Scene {
	constructor() {
		super('levelOverview');
	}

	preload() {
		this.load.scenePlugin({
			key: 'rexuiplugin',
			url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
			sceneKey: 'rexUI'
		});
	}

	create() {
		const midX = WorldWidth / 2;

		this.title = this.add
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

		this.loading = this.add
			.text(
				midX,
				this.title.y + this.title.height + 50,
				"Loading...",
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '30px',
					color: '#fff',
				}
			)
			.setOrigin(0.5, 0);


		let counter = 0;
		this.wins = persistService.getPersistedWins();
		this.previews = persistService.getPersistedPreviews();

		// Loader to wait all base64 Image loaded
		this.textures.on('onload', function () {
			counter++;
		});

		for (const level of allLevels) {
			const win = this.wins.find(w => w.levelKey === level.key);
			const preview = this.previews.find(w => w.levelKey === level.key);
			let imageBase64 = undefined;
			if (win) {
				imageBase64 = win.imageBase64;
			} else if (preview) {
				imageBase64 = preview.imageBase64;
			}
			const key = 'preview_' + level.key;
			if (this.textures.exists(key)) {
				this.textures.removeKey(key);
			}
			debugger;
			if (imageBase64 === undefined) {
				continue;
			}
			this.textures.addBase64(key, imageBase64);
		};



		// Timer check when all based64 assets have been loaded
		this.customTimer = this.time.addEvent({
			delay: 500, callback: () => {
				if (counter === allLevels.length) {

					// Destroy timer to save memory
					this.customTimer.remove(false);
					this.loading.setVisible(false);

					this.createAfterAllImagesAreLoaded();
				}

			}, callbackScope: this, loop: true
		});
	}

	createAfterAllImagesAreLoaded() {
		const midX = WorldWidth / 2;

		this.track = this.add.rectangle(0, 0, 20, 10, 0x6D6D6D)//.setVisible(true);
		this.thumb = this.add.rectangle(0, 0, 10, 100, 0xFFFFFF)//.setVisible(true);

		this.setupScroll(midX);
	}

	setupScroll(midX) {
		this.isSetup = true
		this.scrollablePanel = this.rexUI.add.scrollablePanel({
			x: midX,
			y: ((WorldHeight - (this.title.y + this.title.height + 30)) / 2) + (this.title.y + this.title.height + 30),
			width: WorldWidth - 100,
			height: WorldHeight - (this.title.y + this.title.height + 30),
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
				const level = allLevels.find(l => l.name === child.text.split(":")[0]);
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
		window.images = {}
		for (const level of allLevels) {
			const win = this.wins.find(w => w.levelKey === level.key);
			const preview = this.previews.find(w => w.levelKey === level.key);
			let background;
			const height = WorldHeight / 3.5;
			let levelText = level.name;

			if (win) {
				levelText += `: ${win.score} star${win.score === 1 ? "" : "s"}`
			}

			if (win || preview) {
				const key = 'preview_' + level.key;
				const image = this.add.sprite(0, 0, key)
					.setOrigin(0.5, 0);
				const scaleFactor = height / image.height;
				image.setSize(image.width * scaleFactor, image.height * scaleFactor);
				background = image
				window.images[key] = image;
			} else {
				background = this.add.rectangle(0, 0, (WorldWidth - 180) / 3, height, 0x474747);
			}
			const item = this.rexUI.add.label({
				width: background.width || (WorldWidth - 180) / 3, height: background.height,
				background: background,
				text: this.add.text(0, 0, levelText, {
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
}