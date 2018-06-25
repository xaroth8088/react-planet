export default class PixelSurface {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8Array(width * height * 4);
    }

    setPixel(x, y, r, g, b, a) {
        const i = 4 * (y * this.width + x);
        this.pixels[i] = r * 255;
        this.pixels[i + 1] = g * 255;
        this.pixels[i + 2] = b * 255;
        this.pixels[i + 3] = a * 255;
    }
}
