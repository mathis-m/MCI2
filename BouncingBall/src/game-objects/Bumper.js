import {ComponentBase} from "./ComponentBase";
import {Rotatable} from "../gestures/Rotatable";

export class Bumper extends ComponentBase {
    constructor(bumperGameObject) {
        super(bumperGameObject);

        this.target = bumperGameObject;
        this.rotatable = new Rotatable(bumperGameObject)
        this.setupRotationGesture();
    }

    setupRotationGesture() {
        this.rotatable.emitter
            .on('rotate', (rotate) => {
                debugger
                this.target.angle += rotate.angle;
            })
            .on('drag1', (rotate) => {
                debugger
                const dragVector = rotate.drag1Vector;
                this.target.x += dragVector.x;
                this.target.y += dragVector.y;
            })
    }
}
