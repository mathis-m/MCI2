import wallImg from "../assets/ball.png";

export const InitialBallVelocity = {
    Low: -20,
    Medium: -30,
    High: -40,
}

export class BouncingBallLevel {
    constructor({ballDropLocationX, ballDropLocationY, initialBallVelocity}, createObstaclesForScene) {
        this.ballDropLocationX = ballDropLocationX;
        this.ballDropLocationY = ballDropLocationY;
        this.initialBallVelocity = initialBallVelocity;
        this.createObstaclesForSceneFn = createObstaclesForScene;
    }

    createObstaclesForScene(scene) {
        return this.createObstaclesForSceneFn(scene);
    }

    preload(scene) {
        scene.load.image('wall', wallImg);
    }
}