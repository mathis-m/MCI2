import Phaser from "phaser";
import {WorldHeight, WorldWidth} from "../world";
import dropLocationArrow from "../assets/drop-location-arrow.svg";

export class TutorialScene extends Phaser.Scene {
	constructor() {
		super('tutorial');
	}

	preload() {
		this.load.svg('drop-arrow', dropLocationArrow);
	}

	create() {
		const midX = WorldWidth / 2;
		const midY = WorldHeight / 2;

		const title = this.add
			.text(
				midX,
				100,
				'Tutorial',
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '40px',
					fill: '#fff',
				}
			)
			.setOrigin(0.5, 0);

		const goalHeader = this.add
			.text(
				50,
				title.y + title.height + 50,
				'Goal:',
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '30px',
					fill: '#fff',
				}
			)
			.setOrigin(0, 0);

		const goalText = this.add
			.text(
				goalHeader.x + goalHeader.width + 20,
				goalHeader.y + goalHeader.height + 20,
				'The ball will fall from the sky, but needs to end up in the basket.\n' +
				'You can place bumpers to accelerate the ball in another direction.\n' +
				'In addition, you can place dampers to slow the ball down.\n' +
				'In each level you will find 3 stars. So place your bumpers wisely in order to collect the stars with the ball!',
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '20px',
					fill: '#fff',
					lineSpacing: 10,
					wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
				}
			)
			.setOrigin(0, 0);

		const legendeHeader = this.add
			.text(
				50,
				goalText.y + goalText.height + 50,
				'Game Objects:',
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '30px',
					fill: '#fff',
				}
			)
			.setOrigin(0, 0);

		const star = this.add.star(50, legendeHeader.y + legendeHeader.height + 20, 5, 10, 15, 0xE7C12C)
			.setOrigin(0, 0)
		const starText = this.add.text(
			star.x + star.width + 10,
			star.y + star.height,
			"Collected stars are the score of the game.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 1)

		const basket = this.createRim(50, starText.y + starText.height + 20)
		const basketText = this.add.text(
			basket.x + basket.width + 10,
			basket.y + basket.height,
			"To win a level the ball needs to end up in the basket.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 1)

		const bumper = this.add.rectangle(50, basketText.y + basketText.height + 20, 30, 5, 0x3EE756)
			.setOrigin(0, 0)
		const bumperText = this.add.text(
			bumper.x + bumper.width + 10,
			bumper.y + bumper.height,
			"Place and Rotate bumpers to accelerate the ball in different directions.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 1)

		const damper = this.add.rectangle(50, bumperText.y + bumperText.height + 20, 30, 5, 0xE7C800)
			.setOrigin(0, 0)
		const damperText = this.add.text(
			damper.x + damper.width + 10,
			damper.y + damper.height,
			"Place and Rotate dampers to slow down the ball.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 1)

		const marker = this.add.sprite(50, damperText.y + 20, 'drop-arrow').setOrigin(0,0);
		const markerText = this.add.text(
			marker.x + marker.width + 10,
			damperText.y + 20,
			"These markers show you where the ball will fall down. There can be up to 3 markers stacked. The count indicates how fast the ball will fall down.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 0)
		const obstacles = this.add.rectangle(50, markerText.y + markerText.height + 20, 10, 40, 0xE724CA)
			.setOrigin(0, 0)
		this.add.text(
			damper.x + damper.width + 10,

			obstacles.y + obstacles.height,
			"Any other objects are obstacles that you need to overcome.",
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '20px',
				fill: '#fff',
				lineSpacing: 10,
				wordWrap: {width: WorldWidth - goalHeader.x - goalHeader.width - 70, useAdvancedWrap: true}
			}
		).setOrigin(0, 1)


		const start = this.add
			.text(
				midX,
				WorldHeight - 100,
				'Click here to play',
				{
					fontFamily: 'Monaco, Courier, monospace',
					fontSize: '30px',
					fill: '#fff',
				}
			)
			.setOrigin(0.5, 1)
			.setInteractive()
			.on('pointerdown', () => {
				this.sound.play("click")

				return this.scene.start('levelOverview');
			})
	}

	createRim(x, y) {
		const borderStrength = 6;
		const halfBorderStrength = borderStrength / 2
		const lineLength = 25
		const halfLineLength = lineLength / 2

		const pos = {
			x,
			y
		}

		x = x + halfLineLength;
		y = y + halfLineLength;

		const leftX = x - halfLineLength;
		const leftY = y;
		const rightX = x + halfLineLength;
		const rightY = y;
		const bottomX = x;
		const bottomY = y + halfLineLength - halfBorderStrength;

		this.add.rectangle(leftX, leftY, borderStrength, lineLength, 0x3886A3)
		this.add.rectangle(rightX, rightY, borderStrength, lineLength, 0x3886A3)
		this.add.rectangle(bottomX, bottomY, lineLength - borderStrength, borderStrength, 0x3886A3)
		return {
			...pos,
			width: lineLength + borderStrength,
			height: lineLength,
		}
	}
}