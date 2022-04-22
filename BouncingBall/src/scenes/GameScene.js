import Phaser from "phaser";
import {InitialBallVelocity} from "../levels/Level";
import dropLocationArrow from '../assets/drop-location-arrow.svg';
import {WorldHeight, WorldWidth} from "../world";
import {BumperSelectionGroup} from "../game-objects/BumperSelectionGroup";
import {debugLevel} from "../levels/allLevels";
import {persistService} from "../persistService";
import {Trail} from "../game-objects/Trail";

const NoMovementThreshold = 0.001

const RoundState = {
    Idle: 'idle',
    Setup: 'setup',
    Execute: 'execute',
    Over: 'over',
    Win: 'win'
}

const defaultState = {
    roundState: RoundState.Setup,
    roundCount: 0,
    isStarted: false,
    currentLevel: null,
    levelInfo: null,
    selectedBumperIndex: undefined,
    debug: false,
}

const defaultBallMovement = {
    bounce: 0.5,
    friction: 0.000005,
    airFriction: 0.005,
    maxVelocity: 30
}

export class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    init(level) {
        this.ball = undefined;
        this.bumperIntitialAngle = 0;
        this.state = {...defaultState}
        this.ballMovement = {...defaultBallMovement}
        let curLevelInfo = level && Object.keys(level).length > 0
            ? level
            : debugLevel;
        this.state.currentLevel = curLevelInfo.levelObj;
        this.state.levelInfo = {
            name: curLevelInfo.name,
            key: curLevelInfo.key
        }
        this.state.currentLevel.preload(this);
    }

    getInitialBallOptions() {
        return {
            x: this.state.currentLevel.ballDropLocationX,
            y: this.state.currentLevel.ballDropLocationY,
            velocityY: this.state.currentLevel.initialBallVelocity
        };
    }

    preload() {
        // this.load.image('ball', ballImg);
        this.load.svg('drop-arrow', dropLocationArrow);
    }


    create() {
        this.matter.world.setBounds(0, 0, WorldWidth, WorldHeight);
        this.createDropLocationMarker();
        this.createActionGrid();
        if (this.state.debug) {
            this.createDebugInfo();
        }
        this.createObstacles();

        const bumper = this.setupNewBumper();
        this.bumperGroup = new BumperSelectionGroup([
            bumper
        ], this, (i) => this.onBumperSelected(i));

        this.createRim();
        setInterval(() => {
            if (this.state.roundState === RoundState.Execute && this.ball !== undefined) {
                const isMoving = this.checkIfBallIsStillMoving();
                if (!isMoving) {
                    this.evaluateWinOrOver();
                }
            }
        }, 50)
    }

    onBumperSelected(index) {
        this.state.selectedBumperIndex = index;
        this.removeBumperButton.setVisible(index !== undefined)
    }

    isWithinRim({x, y}) {
        if (!this.rimBounds)
            return false;
        return this.matter.bounds.contains(this.rimBounds, {
            x,
            y
        })
    }

    createRim() {
        const x = this.state.currentLevel.rimLocationX;
        const y = this.state.currentLevel.rimLocationY;

        const borderStrength = 20;
        const halfBorderStrength = borderStrength / 2
        const lineLength = 100
        const halfLineLength = lineLength / 2

        const leftX = x - halfLineLength;
        const leftY = y;
        const rightX = x + halfLineLength;
        const rightY = y;
        const bottomX = x;
        const bottomY = y + halfLineLength - halfBorderStrength;

        const leftBorder = this.matter.add.gameObject(this.add.rectangle(leftX, leftY, borderStrength, lineLength, 0x3886A3))
            .setStatic(true)
            .setBounce(-5)
        const rightBorder = this.matter.add.gameObject(this.add.rectangle(rightX, rightY, borderStrength, lineLength, 0x3886A3))
            .setStatic(true)
            .setBounce(-5)
        const bottomBorder = this.matter.add.gameObject(this.add.rectangle(bottomX, bottomY, lineLength - borderStrength, borderStrength, 0x3886A3))
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

        const leftTop = this.matter.vector.create(leftX - halfBorderStrength, leftY - halfLineLength);
        const rightTop = this.matter.vector.create(rightX + halfBorderStrength, rightY - halfLineLength);
        const rightBottom = this.matter.vector.create(rightX + halfBorderStrength, rightY + halfLineLength);
        const leftBottom = this.matter.vector.create(leftX - halfBorderStrength, leftY + halfLineLength);

        this.rimBounds = this.matter.bounds.create([
            leftTop,
            rightTop,
            rightBottom,
            leftBottom
        ]);


    }

    setupNewBumper(bounceFactor = 2.5, color = 0x3EE756) {
        let bumper = this.add.rectangle(WorldWidth / 2, WorldHeight / 3, 150, 20, color)
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
                if (!this.state.isStarted) {
                    this.state.roundState = RoundState.Execute;
                    this.state.isStarted = true;
                } else {
                    this.reset(false)
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
                this.reset(true);
            });

        this.overView = this.add
            .text(
                this.resetButton.x + this.resetButton.width + 30,
                WorldHeight - 10,
                'Choose Level',
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
                this.scene.start("levelOverview");
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
                if (this.state.isStarted)
                    return;
                this.bumperGroup.addBumper(this.setupNewBumper())
            });
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
                if (this.state.isStarted)
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
                if (this.state.isStarted)
                    return;
                if (this.state.selectedBumperIndex !== undefined)
                    this.bumperGroup.removeBumperAt(this.state.selectedBumperIndex)
            });
    }

    createBall() {
        const ballOptions = this.getInitialBallOptions();
        this.ball = this.add.circle(ballOptions.x, ballOptions.y, 16, 0xFFFFF)
        this.ball.setDepth(100)
        this.ball = this.matter.add.gameObject(this.ball)
        this.ball.setBounce(this.ballMovement.bounce)
        this.ball.setCircle(16)
        this.ball.setOrigin(.5)
        this.trail = new Trail(this, this.ball.centerX,this.ball.centerY, '')
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
            const marker = this.add.sprite(ballOptions.x, ballOptions.y + currentOffset, 'drop-arrow');
            this.dropLocationMarkers.push(marker)
            currentOffset += 16;
        }
    }

    createObstacles() {
        this.obstacles = this.state.currentLevel.createObstaclesForScene(this);
        this.obstacles.forEach(o => o.setBounce(-5))
    }

    checkIfBallIsStillMoving() {
        if (!this.isNotMovingCounter)
            this.isNotMovingCounter = 0;

        const xVelocity = this.ball.body.velocity.x
        const yVelocity = this.ball.body.velocity.y

        const isMoving = Math.abs(xVelocity) >= NoMovementThreshold || Math.abs(yVelocity) >= NoMovementThreshold;
        if (!isMoving) {
            this.isNotMovingCounter++;
        }

        return this.isNotMovingCounter < 10;
    }

    evaluateWinOrOver() {
        const isInRim = this.isWithinRim({
            x: this.ball.x,
            y: this.ball.y
        })
        this.state.roundState = isInRim
            ? RoundState.Win
            : RoundState.Over;
    }

    update(time, delta) {
        super.update(time, delta);
        if (this.state.isStarted && this.ball === undefined) {
            this.createBall();
            this.isNotMovingCounter = 0;
            if (this.addBumperButton) {
                this.addBumperButton.setVisible(false);
                this.addDamperButton.setVisible(false);
                this.removeBumperButton.setVisible(false);
            }
            this.startButton.setText("Restart");
        }
        if (this.state.roundState === RoundState.Execute && this.ball !== undefined) {
            this.ensureMaxVelocityOfBall();
            this.trail.x = this.ball.x;
            this.trail.y = this.ball.y;
            this.trail.update(time)
            if (this.state.debug) {
                this.logBallVelocity(this.ball.body.velocity)
            }
        }
        let isWin = this.state.roundState === RoundState.Win;
        if (isWin || this.state.roundState === RoundState.Over) {
            console.log(isWin ? "Level completed" : "Level failed")
            this.state.roundState = RoundState.Idle;
            if(isWin) {
                const score = 3;
                this.renderer.snapshot((image) => {
                    persistService.persistWin(this.state.levelInfo.key, {
                        score,
                        winImage: image
                    })
                    this.scene.start('levelRunFinish', {
                        isWin: true,
                        score,
                        levelKey: this.state.levelInfo.key,
                        winImage: image
                    })
                });

            } else {
                this.reset(false);
            }
        }
    }

    reset(all) {
        this.state.isStarted = false;
        this.state.roundState = RoundState.Setup;
        if(this.ball) {
            this.ball.destroy()
            this.ball = undefined;
        }

        if (this.trail) {
            this.trail.destroy();
            this.trail = undefined;
        }
        this.startButton.setText("Start");
        this.addBumperButton.setVisible(true);
        this.addDamperButton.setVisible(true);
        this.removeBumperButton.setVisible(true);

        if(!all)
            return

        this.bumperIntitialAngle = 0;
        this.bumperGroup.destroy();
        this.bumperGroup = new BumperSelectionGroup([this.setupNewBumper()], this, (i) => this.onBumperSelected(i))
    }

    ensureMaxVelocityOfBall() {
        let cappedXVelocity;
        let needsAdjustment = false;

        if (this.ball.body.velocity.x > this.ballMovement.maxVelocity) {
            cappedXVelocity = this.ballMovement.maxVelocity;
            needsAdjustment = true;
        } else if (this.ball.body.velocity.x < -this.ballMovement.maxVelocity) {
            cappedXVelocity = -this.ballMovement.maxVelocity;
            needsAdjustment = true;
        } else {
            cappedXVelocity = this.ball.body.velocity.x;
        }

        let cappedYVelocity;
        if (this.ball.body.velocity.y > this.ballMovement.maxVelocity) {
            cappedYVelocity = this.ballMovement.maxVelocity;
            needsAdjustment = true;
        } else if (this.ball.body.velocity.y < -this.ballMovement.maxVelocity) {
            cappedYVelocity = -this.ballMovement.maxVelocity;
            needsAdjustment = true;
        } else {
            cappedYVelocity = this.ball.body.velocity.y;
        }
        if (needsAdjustment) {
            if (Number.isNaN(cappedXVelocity) || Number.isNaN(cappedYVelocity)) {
                debugger;
            }
            this.ball.setVelocity(cappedXVelocity, cappedYVelocity)
        }
    }

    logBallVelocity(velocity) {
        const round = (num) => Math.round((num + Number.EPSILON) / NoMovementThreshold) * NoMovementThreshold
        const x = round(velocity.x);
        const y = round(velocity.y);

        if (this.maxVelosityX === undefined || this.maxVelosityX < Math.abs(x)) {
            this.maxVelosityX = Math.abs(x);
        }
        if (this.maxVelosityY === undefined || this.maxVelosityY < Math.abs(y)) {
            this.maxVelosityY = Math.abs(y);
        }
        this.ballVelocityXInfo.setText("Velocity X: " + x);
        this.ballVelocityYInfo.setText("Velocity Y: " + y);
        this.ballVelocityMaxInfo.setText("Max X: " + this.maxVelosityX + " Y: " + this.maxVelosityY);

    }

    createDebugInfo() {
        this.ballVelocityXInfo = this.add
            .text(
                WorldWidth - 10,
                10,
                '',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '15px',
                    fill: '#fff',
                }
            )
            .setOrigin(1, 0)
            .setDepth(100)

        this.ballVelocityYInfo = this.add
            .text(
                WorldWidth - 10,
                this.ballVelocityXInfo.y + this.ballVelocityXInfo.height + 10,
                '',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '15px',
                    fill: '#fff',
                }
            )
            .setOrigin(1, 0)
            .setDepth(100)

        this.ballVelocityMaxInfo = this.add
            .text(
                WorldWidth - 10,
                this.ballVelocityYInfo.y + this.ballVelocityYInfo.height + 10,
                '',
                {
                    fontFamily: 'Monaco, Courier, monospace',
                    fontSize: '15px',
                    fill: '#fff',
                }
            )
            .setOrigin(1, 0)
            .setDepth(100)
    }
}