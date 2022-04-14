import {ComponentBase} from "./ComponentBase";
import {RotateGesture} from "../gestures/RotateGesture";
import {PinchGesture} from "../gestures/Scalable";

export class BumperInteractionBehavior extends ComponentBase {
    constructor(bumperGameObject) {
        super(bumperGameObject);

        this.isEnabled = false;
        this.target = bumperGameObject;

        this.rotatable = new RotateGesture(bumperGameObject)
        this.rotatable.enable = false;
        this.setupRotationGesture();

        this.scalable = new PinchGesture(bumperGameObject)
        this.scalable.enable = false;
        this.setupPinchGesture();
    }

    setupRotationGesture() {
        this.rotatable.emitter
            .on('rotate', (rotate) => {
                if(!this.isEnabled)
                    return

                this.target.angle += rotate.angle;
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
                this.target.width *= scaleFactor;
            })
    }

    toggleEnable() {
        this.isEnabled = !this.isEnabled;
        this.rotatable.toggleEnable();
    }
}

export class BumperSelectionGroup {
    constructor(bumpers) {
        this.bumpers = [];
        this.selectedIndex = undefined;
        for (let i = 0; i < bumpers.length; i++) {
            const bumper = bumpers[i];
            const bumperBehavior = new BumperInteractionBehavior(bumper);
            this.bumpers.push({bumper, bumperBehavior})
            this.setupSelection({bumper, bumperBehavior}, i);
        }
    }

    setupSelection(bumperAndBehavior, i) {
        const bumper = bumperAndBehavior.bumper;
        const bumperBehavior = bumperAndBehavior.bumperBehavior;
        bumper.setInteractive();
        bumper.on('pointerdown', () => {
            if (this.selectedIndex === i) {
                bumper.fillColor = 0xFF0E0C;
                this.selectedIndex = undefined;
                bumperBehavior.toggleEnable();
            } else if (this.selectedIndex === undefined) {
                bumper.fillColor = 0x52FF45;
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
            } else {
                const {bumper: selectedBumper, bumperBehavior: selectedBehavior} = this.bumpers[this.selectedIndex];
                selectedBumper.fillColor = 0xFF0E0C;
                selectedBehavior.toggleEnable();

                bumper.fillColor = 0x52FF45;
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
            }
        })
    }
}