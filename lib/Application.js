import color from 'css-color-converter';
import GenerateTexture from './GenerateTexture';
import PlanetRenderer from './PlanetRenderer';

let loadedModule = null;
let loadingModule = false;

function loadModule() {
    // If we've loaded the module once already, just return it
    if (loadedModule !== null) {
        return new Promise(
            (resolve) => {
                resolve(loadedModule);
            }
        );
    }

    if (loadingModule === true) {
        console.warn('Attempting to load the wasm module more than once.  This may cause out-of-memory errors.');
    }

    loadingModule = true;

    return new Promise((resolve) => {
        GenerateTexture().then((mod) => {
            // The function returned from Emscripten isn't a "real" promise, so we have to hack around it a little to
            // make it behave like a real promise.  To prevent an infinite promise resolution loop, we remove the
            // .then() method from the loaded module when the Emscripten loader finishes.
            mod.then = null; // eslint-disable-line no-param-reassign

            loadedModule = mod;

            resolve(mod);
        });
    });
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
        if (this.config.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001;
            this.planetRenderer.cloudMesh.rotation.y += 0.002;
        }

        this.planetRenderer.render();
        requestAnimationFrame(this.update);
    };
}
