import {ComponentBase} from "./ComponentBase";
import {RotateGesture} from "../gestures/RotateGesture";

export class BumperInteractionBehavior extends ComponentBase {
    constructor(bumperGameObject) {
        super(bumperGameObject);

        this.isEnabled = false;
        this.target = bumperGameObject;

        this.rotatable = new RotateGesture(bumperGameObject)
        this.rotatable.enable = false;
        this.setupRotationGesture();

        //this.scalable = new PinchGesture(bumperGameObject)
        //this.scalable.enable = false;
        //this.setupPinchGesture();
    }

    setupRotationGesture() {
        this.rotatable.emitter
            .on('rotate', (rotate) => {
                if(!this.isEnabled)
                    return

                this.target.angle += rotate.angle
            })
            .on('drag1', (rotate) => {
                if(!this.isEnabled)
                    return

                const dragVector = rotate.drag1Vector;
                this.target.x += dragVector.x;
                this.target.y += dragVector.y;
            })
    }

    setupPinchGesture() {
        this.scalable.emitter
            .on('pinch', (pinch) => {
                if(!this.isEnabled)
                    return
                const scaleFactor = pinch.scaleFactor;
                //this.target.scaleX *= scaleFactor;
                //this.target.setSize(this.target.width, this.target.height)
            })
    }

    toggleEnable() {
        this.isEnabled = !this.isEnabled;
        this.rotatable.toggleEnable();
        //this.scalable.toggleEnable();
    }

    destroy() {
        super.destroy();
        this.rotatable.destroy();
        //this.scalable.destroy();
    }
}

