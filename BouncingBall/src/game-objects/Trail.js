export class Trail extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.positions = [];
        this.color = 0xFFFFFF;
        this.trail = this.scene.add.graphics({x, y});
    }

    update(time) {
        if (this.active) {
            this.positions.unshift([this.x, this.y]);
        }

        this.trail.clear();
        for (let i = 0; i < this.positions.length; i++) {
            if (i === 0)
                continue

            this.trail.lineStyle(8, 0x1DB4FF, .9 / (i / (this.positions.length / 2)));
            this.trail.moveTo(this.positions[i - 1][0], this.positions[i - 1][1]);
            this.trail.lineTo(this.positions[i][0], this.positions[i][1]);
        }

        this.trail.stroke()
        for (let j = 0; j < 80; j++) {
            if (j === 0)
                continue
            if (this.positions[j] && this.positions[j - 1]) {
                this.trail.lineStyle(4, 0xFFFFFF, .4 / (j / 100))
                this.trail.moveTo(this.positions[j - 1][0], this.positions[j - 1][1]);
                this.trail.lineTo(this.positions[j][0], this.positions[j][1]);
            }
        }
        this.trail.stroke()
    }

    destroy() {
        super.destroy();
        this.trail.clear();
        this.trail.destroy();
        this.positions.length = 0;
    }
}