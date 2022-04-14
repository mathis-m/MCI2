import {BumperInteractionBehavior} from "./BumperInteractionBehavior";

export class BumperSelectionGroup {
    constructor(bumpers, scene) {
        this.scene = scene
        this.bumpers = [];
        this.selectedIndex = undefined;
        for (let i = 0; i < bumpers.length; i++) {
            const bumper = bumpers[i];
            const bumperBehavior = new BumperInteractionBehavior(bumper);
            this.trackBumper(bumper, bumperBehavior);
        }
    }

    addBumper(bumper) {
        const bumperBehavior = new BumperInteractionBehavior(bumper);
        this.trackBumper(bumper, bumperBehavior);
    }

    trackBumper(bumper, bumperBehavior) {
        const newLength = this.bumpers.push({bumper, bumperBehavior, color: bumper.fillColor});
        this.setupSelection({bumper, bumperBehavior, color: bumper.fillColor}, newLength - 1);
    }

    setupSelection(bumperAndBehavior, i) {
        const bumper = bumperAndBehavior.bumper;
        const color = bumperAndBehavior.color;
        const bumperBehavior = bumperAndBehavior.bumperBehavior;
        bumper.setInteractive();
        bumper.on('pointerup', () => {
            if (this.selectedIndex === i) {
                bumper.setStrokeStyle(0, 0);
                this.selectedIndex = undefined;
                bumperBehavior.toggleEnable();
            } else if (this.selectedIndex === undefined) {
                this.selectedIndex = i;
                bumper.setStrokeStyle(4, 0xFFFFFF);
                bumperBehavior.toggleEnable();
            } else {
                const {selectedBehavior, selectedBumper} = this.getSelectedBumper();
                selectedBehavior.toggleEnable()
                selectedBumper.setStrokeStyle(0, 0);

                bumper.setStrokeStyle(4, 0xFFFFFF);
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
            }
        })
        if (this.selectedIndex !== undefined) {
            const {selectedBehavior, selectedBumper} = this.getSelectedBumper();
            selectedBehavior.toggleEnable()
            selectedBumper.setStrokeStyle(0, 0);
        }
        this.selectedIndex = i;
        bumper.setStrokeStyle(4, 0xFFFFFF);
        bumperBehavior.toggleEnable();
    }

    getSelectedBumper() {
        const {
            bumper: selectedBumper,
            bumperBehavior: selectedBehavior,
            color: selectedBumperColor,
            border,
        } = this.bumpers[this.selectedIndex];
        return {selectedBumper, selectedBehavior, selectedBumperColor, border};
    }

    destroy() {
        this.bumpers.forEach(b => {
            b.bumper.destroy();
            b.bumperBehavior.destroy();
        });
        this.bumpers.length = 0;
        this.selectedIndex = undefined;
    }
}