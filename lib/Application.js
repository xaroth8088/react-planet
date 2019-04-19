import color from 'css-color-converter';
import GenerateTexture from './GenerateTexture';
import PlanetRenderer from './PlanetRenderer';

function loadModule() {
    return new Promise((resolve) => {
        GenerateTexture().then((mod) => {
            mod.then = null; // eslint-disable-line no-param-reassign
            resolve(mod);
        });
    });
}

function convertColor(colorString) {
    const rgba = color(colorString).toRgbaArray();

    // We're intentionally discarding alpha information
    const [r, g, b] = rgba;

    return b + (g << 8) + (r << 16); // eslint-disable-line no-bitwise
}

export default class Application {
    constructor(element, config) {
        this.element = element;
        this.config = config;

        this.planetRenderer = new PlanetRenderer();
    }

    async init() {
        const mymod = await loadModule();

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

        const width = parseInt(this.config.resolution, 10);
        const height = width / 2; // The textures will have a 2:1 aspect ratio

        this.planetRenderer.init(
            width,
            height,
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
        // TODO: Generating the textures can be time-consuming.  To avoid locking the UI, break the work into chunks
        // TODO: explore having a web worker do this instead, so that it doesn't need to worry about blocking the UI

        if (this.config.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001; // TODO: make this speed a param
            this.planetRenderer.cloudMesh.rotation.y += 0.002; // TODO: make this speed a param
        }

        this.planetRenderer.render();
        requestAnimationFrame(this.update);
    };
}
