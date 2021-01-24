import color from 'css-color-converter';
import GenerateTexture from './GenerateTexture';
import PlanetRenderer from './PlanetRenderer';

function fls(mask) {
    /*
        https://github.com/udp/freebsd-libc/blob/master/string/fls.c
    */
    let bit;

    if (mask === 0) {
        return 0;
    }

    for (bit = 1; mask !== 1; bit++) {
        // eslint-disable-next-line no-bitwise, no-param-reassign
        mask >>= 1;
    }

    return (bit);
}

function nearestPowerOfTwo(number) {
    return 2 ** fls(number - 1);
}

function convertColor(colorString) {
    const rgba = color(colorString).toRgbaArray();

    // We're intentionally discarding alpha information
    const [r, g, b] = rgba;

    // Pack the color for transport to wasm-land as an int32
    return b + (g << 8) + (r << 16); // eslint-disable-line no-bitwise
}

export default class Application {
    constructor(element, config) {
        this.element = element;
        this.config = config;

        this.planetRenderer = new PlanetRenderer();
    }

    async init() {
        const mymod = await GenerateTexture();

        // Colors can be specified as CSS-like constructs, but need to be converted to i32 before passing them
        const { config } = this;
        if (this.config.landColor1) {
            config.landColor1 = convertColor(this.config.landColor1);
        }
        if (this.config.landColor2) {
            config.landColor2 = convertColor(this.config.landColor2);
        }
        if (this.config.waterDeep) {
            config.waterDeep = convertColor(this.config.waterDeep);
        }
        if (this.config.waterShallow) {
            config.waterShallow = convertColor(this.config.waterShallow);
        }
        if (this.config.cloudColor) {
            config.cloudColor = convertColor(this.config.cloudColor);
        }

        this.textureGenerator = new mymod.TextureGenerator({
            ...config
        });

        this.textureGenerator.GenerateTextures();

        const diffusePixels = this.textureGenerator.getDiffuseTexture();
        const normalPixels = this.textureGenerator.getNormalTexture();
        const specularPixels = this.textureGenerator.getSpecularTexture();
        const cloudPixels = this.textureGenerator.getCloudTexture();

        // Resolution must be bumped up to the nearest power of 2
        const resolution = nearestPowerOfTwo(parseInt(this.config.resolution, 10));

        this.planetRenderer.init(
            resolution,
            diffusePixels,
            normalPixels,
            specularPixels,
            cloudPixels,
            this.config.normalScale
        );
        this.element.appendChild(this.planetRenderer.canvas);

        const size = this.element.clientWidth;
        this.planetRenderer.setSize(size, size);
    }

    update = () => {
        if (this.config.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001;
            this.planetRenderer.cloudMesh.rotation.y += 0.002;
        }

        this.planetRenderer.render();
        requestAnimationFrame(this.update);
    };
}
