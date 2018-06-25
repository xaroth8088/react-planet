export default class PixelSurface {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.pixels = this.imageData.data;
    }

    setPixel(x, y, r, g, b, a) {
        const i = 4 * (y * this.width + x);
        this.pixels[i + 0] = r * 256 << 0;
        this.pixels[i + 1] = g * 256 << 0;
        this.pixels[i + 2] = b * 256 << 0;
        this.pixels[i + 3] = a * 256 << 0;
    }

    update() {
        this.context.putImageData(this.imageData, 0, 0);
    }
}
