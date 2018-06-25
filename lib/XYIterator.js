export default class XYIterator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = -1;
        this.y = 0;
    }

    next() {
        if (this.y === this.height) {
            return {
                x: this.width - 1,
                y: this.width - 1,
                done: 1
            };
        }
        this.x++;
        if (this.x === this.width) {
            this.x = 0;
            this.y++;
        }
        if (this.y === this.height) {
            return {
                x: this.width - 1,
                y: this.width - 1,
                done: 1
            };
        }
        return {
            x: this.x,
            y: this.y,
            done: (this.y * this.width + this.x) / (this.width * this.height)
        };
    }
}
