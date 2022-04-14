import {BumperInteractionBehavior} from "./BumperInteractionBehavior";

export class BumperSelectionGroup {
    constructor(bumpers) {
        this.bumpers = [];
        this.selectedIndex = undefined;
        for (let i = 0; i < bumpers.length; i++) {
            const bumper = bumpers[i];
            const bumperBehavior = new BumperInteractionBehavior(bumper);
            this.bumpers.push({bumper, bumperBehavior, color: bumper.fillColor})
            this.setupSelection({bumper, bumperBehavior, color: bumper.fillColor}, i);
        }
    }

    addBumper(bumper) {
        const bumperBehavior = new BumperInteractionBehavior(bumper);
        const newLength = this.bumpers.push({bumper, bumperBehavior, color: bumper.fillColor})
        this.setupSelection({bumper, bumperBehavior, color: bumper.fillColor}, newLength - 1);
    }

    setupSelection(bumperAndBehavior, i) {
        const bumper = bumperAndBehavior.bumper;
        const color = bumperAndBehavior.color;
        const bumperBehavior = bumperAndBehavior.bumperBehavior;
        bumper.setInteractive();
        bumper.on('pointerup', () => {
            if (this.selectedIndex === i) {
                bumper.fillColor = color;
                this.selectedIndex = undefined;
                bumperBehavior.toggleEnable();
            } else if (this.selectedIndex === undefined) {
                bumper.fillColor =  hexToComplimentary(color);
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
            } else {
                const {bumper: selectedBumper, bumperBehavior: selectedBehavior, color: selectedBumperColor} = this.bumpers[this.selectedIndex];
                selectedBumper.fillColor = selectedBumperColor;
                selectedBehavior.toggleEnable()

                bumper.fillColor = hexToComplimentary(color);
                this.selectedIndex = i;
                bumperBehavior.toggleEnable();
            }
        })
        if (this.selectedIndex !== undefined) {
            const {bumper: selectedBumper, bumperBehavior: selectedBehavior, color: selectedBumperColor} = this.bumpers[this.selectedIndex];
            selectedBumper.fillColor = selectedBumperColor;
            selectedBehavior.toggleEnable()
        }
        bumper.fillColor = hexToComplimentary(color);
        this.selectedIndex = i;
        this.selectedBumper = bumperAndBehavior;
        bumperBehavior.toggleEnable();
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

const hexToComplimentary = hex => {
    let r = (hex >> 16) & 0xFF, g = (hex >> 8) & 0xFF, b = hex & 0xFF;

    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2.0;

    if(max === min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max === r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max === r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max === g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max === b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0;

    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    if(s === 0){
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    const rgb = b | (g << 8) | (r << 16);
    return (0x1000000 | rgb)
};