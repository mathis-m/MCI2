import ballImage from "../assets/ball.png";

export const InitialBallVelocity = {
	Low: 0,
	Medium: 1,
	High: 2,
}

export class BouncingBallLevel {
	/**
	 *
	 * @param ballDropLocationX
	 * @param ballDropLocationY
	 * @param initialBallVelocity
	 * @param {(scene: Phaser.Scene) => any[]} createObstaclesForScene
	 * @param rimLocationX
	 * @param rimLocationY
	 * @param starPositions
	 */
	constructor(
		{ballDropLocationX, ballDropLocationY, initialBallVelocity},
		createObstaclesForScene,
		{rimLocationX, rimLocationY},
		starPositions,
	) {
		this.ballDropLocationX = ballDropLocationX;
		this.ballDropLocationY = ballDropLocationY;
		this.initialBallVelocity = initialBallVelocity;
		this.createObstaclesForSceneFn = createObstaclesForScene;
		this.rimLocationX = rimLocationX;
		this.rimLocationY = rimLocationY;
		this.starPositions = starPositions;
	}

	createObstaclesForScene(scene) {
		return this.createObstaclesForSceneFn(scene);
	}

	createRimForScene() {

	}

	preload(scene) {
		scene.load.image('wall', ballImage);
	}
}