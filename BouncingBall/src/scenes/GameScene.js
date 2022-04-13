import Phaser from "phaser";
import {BouncingBallLevel, InitialBallVelocity} from "../levels/Level";
import ballImg from '../assets/ball.png';
import dropLocationArrow from '../assets/drop-location-arrow.svg';
import {WorldHeight, WorldWidth} from "../world";
import {Bumper} from "../game-objects/Bumper";

const RoundState = {
    Idle: 'idle',
    Setup: 'setup',
    Execute: 'execute'
}

const level1 = new BouncingBallLevel(
    {
        ballDropLocationX: 20,
        ballDropLocationY: 0,
        initialBallVelocity: InitialBallVelocity.Low
    },
    (scene) => {
        const height = WorldHeight / 2;
        const midX = WorldWidth / 2;
        const lowerY = WorldHeight - (height / 2);
        const simpleWall = scene.add.rectangle(midX, lowerY, 148, height, 0xB86F2A);
        return [
            scene.matter.add.gameObject(simpleWall)
                .setStatic(true)
        ];
    }
)

const defaultState = {
    roundState: RoundState.Idle,
    roundCount: 0,
    currentLevel: level1
}

const defaultBallMovement = {
    bounce: 1,
    friction: 0.000005,
    airFriction: 0.005,
}

export class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super('game');
        this.state = {...defaultState}
        this.ballMovement = {...defaultBallMovement}
    }

    getInitialBallOptions() {
        return {
            x: this.state.currentLevel.ballDropLocationX,
            y: this.state.currentLevel.ballDropLocationY,
            velocityY: this.state.currentLevel.initialBallVelocity
        };
    }

    preload ()
    {
        this.load.image('ball', ballImg);
        this.load.svg('drop-arrow', dropLocationArrow);
        this.state.currentLevel.preload(this);
    }

    create ()
    {
        this.matter.world.setBounds(0, 0, WorldWidth, WorldHeight);
        this.createBall();
        this.createObstacles();

        let bumper = this.add.rectangle(50, 400, 150, 10, 0xFF0E0C)
        bumper = this.matter.add.gameObject(bumper)
        bumper.setStatic(true);
        bumper.setAngle(45);
        bumper.setBounce(2)
        new Bumper(bumper);
    }

    createBall() {
        const ballOptions = this.getInitialBallOptions();
        this.ball = this.matter.add.sprite(ballOptions.x, ballOptions.y, 'ball', null)
        this.ball.setBounce(this.ballMovement.bounce)
        this.ball.setFrictionAir(this.ballMovement.airFriction)
        this.ball.setFriction(this.ballMovement.friction, this.ballMovement.friction, this.ballMovement.friction)
    }

    createDropLocationMarker() {
        const ballOptions = this.getInitialBallOptions();
        this.dropLocationMarkers = [];
        let currentOffset = 40;

        const count = this.state.currentLevel.initialBallVelocity === InitialBallVelocity.Low
            ? 1
            : this.state.currentLevel.initialBallVelocity === InitialBallVelocity.Medium
                ? 2
                : 3;

        for (let i = 0; i < count; i++) {
            const marker = this.physics.add.sprite(ballOptions.x + 16, ballOptions.y + currentOffset, 'drop-arrow');
            this.dropLocationMarkers.push(marker)
            currentOffset += 16;
        }
    }

    createObstacles() {
        this.obstacles = this.state.currentLevel.createObstaclesForScene(this);
        this.obstacles.forEach(o => o.setBounce(-5))
    }

}