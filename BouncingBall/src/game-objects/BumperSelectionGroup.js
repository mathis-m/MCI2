import {BumperInteractionBehavior} from "./BumperInteractionBehavior";

export class BumperSelectionGroup {
    constructor(bumpers, scene, onSelect) {
        this._selectEnabled = true;
        this.scene = scene
        this.onSelect = onSelect;
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

    removeBumperAt(index) {
        const newBumpers = [...this.bumpers];
        const deleted = newBumpers.splice(index, 1)[0]
        deleted.bumper.off('pointerdown', deleted.onFn);
        deleted.bumper.destroy();
        deleted.bumperBehavior.destroy();

        this.bumpers.length = 0;
        this.selectedIndex = undefined;

        for (let i = 0; i < newBumpers.length; i++) {
            newBumpers[i].bumper.off('pointerdown', newBumpers[i].onFn)
            this.trackBumper(newBumpers[i].bumper, newBumpers[i].bumperBehavior, false);
        }
    }

    trackBumper(bumper, bumperBehavior, selectNewest = true) {
        const newLength = this.bumpers.push({bumper, bumperBehavior, color: bumper.fillColor});
        const i = newLength - 1;
        const onFn = () => {
            if(!this._selectEnabled)
                return;
            if (this.selectedIndex === i) {
                // petter ux when it stays selected
                // enables to drag on a selected

                /*bumper.setStrokeStyle(0, 0);
                this.selectedIndex = undefined;
                bumperBehavior.toggleEnable();
                this.onSelect(undefined)*/
            } else if (this.selectedIndex === undefined) {
                this.selectedIndex = i;
                bumper.setStrokeStyle(4, 0xFFFFFF);
                bumperBehavior.toggleEnable();
                this.onSelect(i);
            } else {
                const {selectedBehavior, selectedBumper} = this.getSelectedBumper();
                selectedBehavior.toggleEnable()
                selectedBumper.setStrokeStyle(0, 0);

                bumper.setStrokeStyle(4, 0xFFFFFF);
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
                this.onSelect(i);
            }
        }
        this.bumpers[i].onFn = onFn;
        this.setupSelection({bumper, bumperBehavior, color: bumper.fillColor, onFn}, i, selectNewest);
    }

    setupSelection(bumperAndBehavior, i, selectNewest = true) {
        const bumper = bumperAndBehavior.bumper;
        const bumperBehavior = bumperAndBehavior.bumperBehavior;
        const onFn = bumperAndBehavior.onFn;
        bumper.setInteractive();
        bumper.on('pointerdown', onFn)
        if(selectNewest) {
            if (this.selectedIndex !== undefined) {
                const {selectedBehavior, selectedBumper} = this.getSelectedBumper();
                selectedBehavior.toggleEnable()
                selectedBumper.setStrokeStyle(0, 0);
            }
            this.selectedIndex = i;
            bumper.setStrokeStyle(4, 0xFFFFFF);
            bumperBehavior.toggleEnable();
            this.onSelect(i);
        }
    }

    getSelectedBumper() {
        if(this.bumpers[this.selectedIndex] === undefined) {
            debugger;
        }
        const {
            bumper: selectedBumper,
            bumperBehavior: selectedBehavior,
            onFn
        } = this.bumpers[this.selectedIndex];
        return {selectedBumper, selectedBehavior, onFn};
    }

    destroy() {
        this.bumpers.forEach(b => {
            b.bumper.destroy();
            b.bumperBehavior.destroy();
        });
        this.bumpers.length = 0;
        this.selectedIndex = undefined;
    }

    setSelectEnabled(enabled) {
        if(this._selectEnabled === enabled)
            return;

        this._selectEnabled = enabled;
        if(!enabled) {
            if (this.selectedIndex === undefined)
                return;
            const {selectedBehavior, selectedBumper, onFn} = this.getSelectedBumper();
            selectedBehavior.toggleEnable()
            selectedBumper.setStrokeStyle(0, 0);
            this.selectedIndex = undefined;
            this.onSelect(undefined);
        }
    }
}