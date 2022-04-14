import {getSceneObject, isSceneObject} from "../game-objects/ComponentBase";
import {WorldBounds} from "../world";
import {EventEmitter} from "../event-emitter/event-emitter";

const SpliceOne = Phaser.Utils.Array.SpliceOne;
const DistanceBetween = Phaser.Math.Distance.Between;
const AngleBetween = Phaser.Math.Angle.Between;

export class TwoPointersTracer {
    constructor(gameObjectOrScene) {
        this.emitter = new EventEmitter();
        this.target = gameObjectOrScene;
        this.targetIsScene = isSceneObject(gameObjectOrScene);

        this.scene = getSceneObject(gameObjectOrScene);

        const amount = this.scene.input.manager.pointersTotal - 1;
        if (amount < 2) {
            this.scene.input.addPointer(2 - amount);
        }

        this._enable = true;
        this.bounds = this.scene.matter.bounds;
        this.tracerState = TOUCH0;

        this.pointers = [];
        this.movedState = {};
        this.boot();
    }

    boot() {
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);
        this.scene.sys.events.once('shutdown', this.destroy, this);
    }

    shutdown() {
        if (!this.scene) {
            return
        }

        this.pointers.length = 0;
        this.movedState = {}
        const handler = this.targetIsScene ? this.target.input : this.target
        handler.input.off('pointerdown', this.onPointerDown, this);
        handler.input.off('pointerup', this.onPointerUp, this);
        handler.input.off('pointermove', this.onPointerMove, this);
        this.scene.sys.events.off('shutdown', this.destroy, this);
        this.scene = undefined;
        this.target = undefined;
        this.emitter.destroy();
    }

    destroy() {
        this.shutdown();
    }

    get enable() {
        return this._enable;
    }

    set enable(e) {
        if (this._enable === e) {
            return;
        }

        if (!e) {
            this.dragCancel();
        }
        this._enable = e;
        return this;
    }

    setEnable(e) {
        if (e === undefined) {
            e = true;
        }

        this.enable = e;
        return this;
    }

    toggleEnable() {
        this.setEnable(!this.enable);
        return this;
    }

    onPointerDown(pointer) {
        if (!this.enable) {
            return;
        }

        if (this.pointers.length === 2) {
            return;
        }

        const isInsideBounds = this.bounds ? this.bounds.contains(WorldBounds, {x: pointer.x, y: pointer.y}) : true;
        if (!isInsideBounds) {
            return;
        }

        const index = this.pointers.indexOf(pointer);
        if (index !== -1) { // Already in catched pointers
            return;
        }

        this.movedState[pointer.id] = false;
        this.pointers.push(pointer);

        switch (this.tracerState) {
            case TOUCH0:
                this.tracerState = TOUCH1;
                this.onDrag1Start();
                break;
            case TOUCH1:
                this.tracerState = TOUCH2;
                this.onDrag2Start();
                break;
        }
    }

    onPointerUp(pointer) {
        if (!this.enable) {
            return;
        }

        const isInsideBounds = this.bounds ? this.bounds.contains(WorldBounds, {x: pointer.x, y: pointer.y}) : true;
        if (!isInsideBounds) {
            return;
        }

        const index = this.pointers.indexOf(pointer);
        if (index === -1) { // Not in catched pointers
            return;
        } else {
            delete this.movedState[pointer.id];
            SpliceOne(this.pointers, index);
        }

        switch (this.tracerState) {
            case TOUCH1:
                this.tracerState = TOUCH0;
                this.onDrag1End();
                break;
            case TOUCH2:
                this.tracerState = TOUCH1;
                this.onDrag2End();
                this.onDrag1Start();
                break;
        }
    }

    onPointerMove(pointer) {
        if (!this.enable) {
            return;
        }

        if (pointer.isDown) {
            const isInsideBounds = this.bounds ? this.bounds.contains(WorldBounds, {x: pointer.x, y: pointer.y}) : true;
            const isCatchedPointer = (this.pointers.indexOf(pointer) !== -1);
            if (!isCatchedPointer && isInsideBounds) { // Pointer moves into bounds
                // this.onPointerDown(pointer);
            } else if (isCatchedPointer && !isInsideBounds) { // Pointer moves out of bounds, lose pointer
                this.onPointerUp(pointer);
            } else {  // Pointer drags in bounds
                if (!this.movedState[pointer.id]) {
                    this.movedState[pointer.id] = (pointer.x !== pointer.downX) || (pointer.y !== pointer.downY);
                }
                if (this.movedState[pointer.id]) {
                    switch (this.tracerState) {
                        case TOUCH1:
                            this.onDrag1();
                            break;
                        case TOUCH2:
                            this.onDrag2();
                            break;
                    }
                }
            }
        }
    }

    dragCancel() {
        if (this.tracerState === TOUCH2) {
            this.onDrag2End();
        }
        this.pointers.length = 0;
        this.movedState = {};
        this.tracerState = TOUCH0;
        return this;
    }

    onDrag1Start() {
        this.emitter.emit('drag1start', this);
    }

    onDrag1End() {
        this.emitter.emit('drag1end', this);
    }

    onDrag1() {
        this.emitter.emit('drag1', this);
    }

    onDrag2Start() {
        this.emitter.emit('drag2start', this);
    }

    onDrag2End() {
        this.emitter.emit('drag2end', this);
    }

    onDrag2() {
        this.emitter.emit('drag2', this);
    }

    get distanceBetween() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const p0 = this.pointers[0],
            p1 = this.pointers[1];
        return DistanceBetween(p0.x, p0.y, p1.x, p1.y);
    }

    get angleBetween() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const p0 = this.pointers[0],
            p1 = this.pointers[1];
        return AngleBetween(p0.x, p0.y, p1.x, p1.y);
    }

    get drag1Vector() {
        const pointer = this.pointers[0];
        const tmpDragVector = {};
        if (pointer && this.movedState[pointer.id]) {
            const p1 = pointer.position;
            const p0 = pointer.prevPosition;
            tmpDragVector.x = p1.x - p0.x;
            tmpDragVector.y = p1.y - p0.y;
        } else {
            tmpDragVector.x = 0;
            tmpDragVector.y = 0;
        }
        return tmpDragVector;
    }

    get centerX() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const p0 = this.pointers[0].position;
        const p1 = this.pointers[1].position;
        return (p0.x + p1.x) / 2;
    }

    get centerY() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const p0 = this.pointers[0].position;
        const p1 = this.pointers[1].position;
        return (p0.y + p1.y) / 2;
    }

    getPrevPointers() {
        const preP0 = (this.movedState[this.pointers[0].id]) ? this.pointers[0].prevPosition : this.pointers[0].position;
        const preP1 = (this.movedState[this.pointers[1].id]) ? this.pointers[1].prevPosition : this.pointers[1].position;
        return {preP0, preP1};
    }

    get prevCenterX() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const {preP0, preP1} = this.getPrevPointers();
        return (preP0.x + preP1.x) / 2;
    }

    get prevCenterY() {
        if (this.tracerState !== TOUCH2) {
            return 0;
        }
        const {preP0, preP1} = this.getPrevPointers();
        return (preP0.y + preP1.y) / 2;
    }

    get movementCenterX() {
        return this.centerX - this.prevCenterX;
    }

    get movementCenterY() {
        return this.centerY - this.prevCenterY;
    }

    setRecognizedStateObject(stateObject) {
        this.recongizedState = stateObject;
        return this;
    }

    get state() {
        return this.recongizedState.state;
    }

    set state(newState) {
        this.recongizedState.state = newState;
    }

    cancel() {
        this.state = IDLE;
        return this;
    }
}


const TOUCH0 = 0;
const TOUCH1 = 1;
const TOUCH2 = 2;

const IDLE = 'IDLE';
