import Phaser from "phaser";
import {BouncingBallLevel, InitialBallVelocity} from "../levels/Level";
import ballImg from '../assets/ball.png';
import dropLocationArrow from '../assets/drop-location-arrow.svg';
import {WorldHeight, WorldWidth} from "../world";
import {BumperSelectionGroup} from "../game-objects/BumperSelectionGroup";

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
    },
    {
        rimLocationX: WorldWidth * 0.8,
        rimLocationY: WorldHeight * 0.8,
    }
)

const defaultState = {
    roundState: RoundState.Idle,
    roundCount: 0,
    isStarted: false,
    currentLevel: level1,
    selectedBumperIndex: undefined
}

const defaultBallMovement = {
    bounce: 0.5,
    friction: 0.000005,
    airFriction: 0.005,
}

export class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super('game');
        this.bumperIntitialAngle = 0;
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

    preload()
    {
        // this.load.image('ball', ballImg);
        this.load.svg('drop-arrow', dropLocationArrow);
        this.state.currentLevel.preload(this);
    }

    create()
    {
        this.matter.world.setBounds(0, 0, WorldWidth, WorldHeight);
        this.createDropLocationMarker();
        this.createActionGrid();
        this.createObstacles();

        const bumper = this.setupNewBumper();
        this.bumperGroup = new BumperSelectionGroup([
            bumper
        ], this, (i) => this.onBumperSelected(i));

        this.createRim();
    }

    onBumperSelected (index) {
        this.state.selectedBumperIndex = index;
        this.removeBumperButton.setVisible(index !== undefined)
    }

    createRim() {
        const x = this.state.currentLevel.rimLocationX;
        const y = this.state.currentLevel.rimLocationY;
        const leftBorder = this.matter.add.gameObject(this.add.rectangle(x - 40, y, 10, 80, 0x3886A3))
            .setStatic(true)
            .setBounce(-5)
        const rightBorder = this.matter.add.gameObject(this.add.rectangle(x + 40, y, 10, 80, 0x3886A3))
            .setStatic(true)
            .setBounce(-5)
        const bottomBorder = this.matter.add.gameObject(this.add.rectangle(x, y + 35, 70, 10, 0x3886A3))
            .setStatic(true)
            .setBounce(-5)
        this.rim = this.add.group([
            leftBorder,
            rightBorder,
            bottomBorder
        ])
        this.rim = this.matter.add.gameObject(this.rim)
        this.rim.setBounce(-5);
        this.rim.setStatic(true);
    }

    setupNewBumper(bounceFactor = 2.5, color = 0x3EE756) {
        let bumper = this.add.rectangle(WorldWidth / 2, WorldHeight / 3, 150, 10, color)
        bumper = this.matter.add.gameObject(bumper)
        bumper.setStatic(true);
        bumper.setAngle(this.bumperIntitialAngle);
        bumper.setBounce(bounceFactor);
        this.bumperIntitialAngle += 15;
        return bumper;
    }

    createActionGrid() {
        this.startButton = this.add
            .text(
                WorldWidth - 10,
                WorldHeight - 10,
                'Start',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(1)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                if(!this.state.isStarted)
                    this.state.isStarted = true;
                else {
                    this.state.isStarted = false;
                    this.ball.destroy()
                    this.ball = undefined;
                    this.startButton.setText("Start");
                    this.addBumperButton.setVisible(true);
                    this.addDamperButton.setVisible(true);
                    this.removeBumperButton.setVisible(true);
                }
                this.bumperGroup.setSelectEnabled(!this.state.isStarted);

            });

        this.resetButton = this.add
            .text(
                10,
                WorldHeight - 10,
                'Reset',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(0, 1)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                this.state.isStarted = false;
                if(this.ball)
                    this.ball.destroy()
                this.ball = undefined;
                this.startButton.setText("Start");
                this.addBumperButton.setVisible(true);
                this.addDamperButton.setVisible(true);
                this.bumperIntitialAngle = 0;
                this.bumperGroup.destroy();
                this.bumperGroup = new BumperSelectionGroup([this.setupNewBumper()], this, (i) => this.onBumperSelected(i))
            });

        this.addBumperButton = this.add
            .text(
                this.startButton.x - this.startButton.width - 30,
                WorldHeight - 10,
                'Add Bumper',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(1)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                if(this.state.isStarted)
                    return;
                this.bumperGroup.addBumper(this.setupNewBumper())
            });
        console.log(this.addBumperButton)
        this.addDamperButton = this.add
            .text(
                this.addBumperButton.x - this.addBumperButton.width - 30,
                WorldHeight - 10,
                'Add Damper',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setOrigin(1)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                if(this.state.isStarted)
                    return;
                this.bumperGroup.addBumper(this.setupNewBumper(-1, 0xE7C800))
            });

        this.removeBumperButton = this.add
            .text(
                this.addDamperButton.x - this.addDamperButton.width - 30,
                WorldHeight - 10,
                'Remove',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '20px',
                    fill: '#fff',
                }
            )
            .setVisible(false)
            .setOrigin(1)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                if(this.state.isStarted)
                    return;
                if(this.state.selectedBumperIndex !== undefined)
                    this.bumperGroup.removeBumperAt(this.state.selectedBumperIndex)
            });
    }

    createBall() {
        const ballOptions = this.getInitialBallOptions();
        this.ball = this.add.circle(ballOptions.x, ballOptions.y, 16, 0xFFFFF)
        this.ball = this.matter.add.gameObject(this.ball)
        this.ball.setBounce(this.ballMovement.bounce)
        this.ball.setCircle(16)
        //this.ball.setFrictionAir(this.ballMovement.airFriction)
        //this.ball.setFriction(this.ballMovement.friction, this.ballMovement.friction, this.ballMovement.friction)
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
            const marker = this.add.sprite(ballOptions.x + 16, ballOptions.y + currentOffset, 'drop-arrow');
            this.dropLocationMarkers.push(marker)
            currentOffset += 16;
        }
    }

    createObstacles() {
        this.obstacles = this.state.currentLevel.createObstaclesForScene(this);
        this.obstacles.forEach(o => o.setBounce(-5))
    }

    update(time, delta) {
        super.update(time, delta);
        if(this.state.isStarted && this.ball === undefined) {
            this.createBall();
            if(this.addBumperButton) {
                this.addBumperButton.setVisible(false);
                this.addDamperButton.setVisible(false);
                this.removeBumperButton.setVisible(false);
            }
            this.startButton.setText("Restart");
        }
    }

}