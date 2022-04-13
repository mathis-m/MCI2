import {TwoPointersTracer} from "./TwoPointersTracer";
import {FSM} from "../state-machine/fsm";
import {EventEmitter} from "../event-emitter/event-emitter";

const WrapDegrees = Phaser.Math.Angle.WrapDegrees; // Wrap degrees: -180 to 180
const ShortestBetween = Phaser.Math.Angle.ShortestBetween;
const RadToDeg = Phaser.Math.RadToDeg;
const DegToRad = Phaser.Math.DegToRad;

const IDLE = 'IDLE';
const BEGIN = 'BEGIN';
const RECOGNIZED = 'RECOGNIZED';

export class Rotatable extends TwoPointersTracer {
    constructor(gameObjectOrScene, config) {
        super(gameObjectOrScene, config);
        this.tracer = new TwoPointersTracer(gameObjectOrScene);

        const self = this;
        const stateConfig = {
            states: {
                IDLE: {
                    enter: function () {
                        self.prevAngle = undefined;
                        self.angle = 0;
                    },
                },
                BEGIN: {},
                RECOGNIZED: {
                    enter: function () {
                        self.emitter.emit('rotatestart', self);
                    },
                    exit: function () {
                        self.emitter.emit('rotateend', self);
                    }
                }
            },
            init: function () {
                this.state = IDLE;
            },
            eventEmitter: false,
        };
        this.setRecognizedStateObject(new FSM(stateConfig));
        this.setDragThreshold(0);
    }

    onDrag2Start() {
        debugger
        this.prevAngle = WrapDegrees(RadToDeg(this.angleBetween)); // Degrees
        this.state = BEGIN;
        if (this.dragThreshold === 0) {
            this.state = RECOGNIZED;
        }
    }

    onDrag2End() {
        this.state = IDLE;
    }

    onDrag2() {
        let curAngle;
        switch (this.state) {
            case BEGIN:
                if ((this.pointers[0].getDistance() >= this.dragThreshold) &&
                    (this.pointers[1].getDistance() >= this.dragThreshold)) {
                    curAngle = WrapDegrees(RadToDeg(this.angleBetween));
                    this.angle = ShortestBetween(this.prevAngle, curAngle);
                    this.prevAngle = curAngle;
                    this.state = RECOGNIZED;
                }
                break;
            case RECOGNIZED:
                curAngle = WrapDegrees(RadToDeg(this.angleBetween));
                this.angle = ShortestBetween(this.prevAngle, curAngle);
                this.prevAngle = curAngle;
                this.emitter.emit('rotate', this);
                break;
        }
    }

    get isRotated() {
        return (this.state === RECOGNIZED);
    }

    get rotation() {
        return DegToRad(this.angle);
    }

    setDragThreshold(distance) {
        this.dragThreshold = distance;
        return this;
    }

}