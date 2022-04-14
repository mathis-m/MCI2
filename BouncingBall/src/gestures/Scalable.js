import {TwoPointersTracer} from "./TwoPointersTracer";
import {FSM} from "../state-machine/fsm";
import {EventEmitter} from "../event-emitter/event-emitter";
const IDLE = 'IDLE';
const BEGIN = 'BEGIN';
const RECOGNIZED = 'RECOGNIZED';
export class PinchGesture extends TwoPointersTracer {
    constructor(scene, config) {
        super(scene, config);

        this.emitter = new EventEmitter();
        this.threshold = 0;
        const self = this;
        const stateConfig = {
            states: {
                IDLE: {
                    enter: function () {
                        self.prevDistance = undefined;
                        self.scaleFactor = 1;
                    },
                },
                BEGIN: {},
                RECOGNIZED: {
                    enter: function () {
                        self.emitter.emit('pinchstart', self);
                    },
                    exit: function () {
                        self.emitter.emit('pinchend', self);
                    }
                }
            },
            init: function () {
                this.state = IDLE;
            },
            eventEmitter: false,
        };
        this.setRecognizedStateObject(new FSM(stateConfig));
    }

    onDrag2Start() {
        this.scaleFactor = 1;
        this.prevDistance = this.distanceBetween;
        this.state = BEGIN;
        if (this.dragThreshold === 0) {
            this.state = RECOGNIZED;
        }
    }

    onDrag2End() {
        this.state = IDLE;
    }

    onDrag2() {
        let curDistance;
        switch (this.state) {
            case BEGIN:
                if ((this.pointers[0].getDistance() >= this.dragThreshold) &&
                    (this.pointers[1].getDistance() >= this.dragThreshold)) {
                    curDistance = this.distanceBetween;
                    this.scaleFactor = curDistance / this.prevDistance;
                    this.prevDistance = curDistance;
                    this.state = RECOGNIZED;
                }
                break;
            case RECOGNIZED:
                curDistance = this.distanceBetween;
                this.scaleFactor = curDistance / this.prevDistance;
                this.emitter.emit('pinch', this);
                this.prevDistance = curDistance;
                break;
        }
    }

    get isPinched() {
        return (this.state === RECOGNIZED);
    }

    setDragThreshold(distance) {
        this.dragThreshold = distance;
        return this;
    }
x}