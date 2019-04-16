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

export default class Application {
    constructor(element, config) {
        this.element = element;
        this.config = config;

        this.planetTexture = null;
        this.planetRenderer = new PlanetRenderer();
    }

    async init() {
        const mymod = await loadModule();

        this.textureGenerator = new mymod.TextureGenerator({
            ...this.config
        });

        this.textureGenerator.GenerateTextures();

        const diffusePixels = this.textureGenerator.getDiffuseTexture();
        const normalPixels = this.textureGenerator.getNormalTexture();
        const specularPixels = this.textureGenerator.getSpecularTexture();
        const cloudPixels = this.textureGenerator.getCloudTexture();

        const width = parseInt(this.config.resolution, 10);
        const height = width / 2; // The textures will have a 2:1 aspect ratio
        this.planetTexture = {
            diffuse: {
                pixels: diffusePixels,
                width,
                height
            },
            normal: {
                pixels: normalPixels,
                width,
                height
            },
            specular: {
                pixels: specularPixels,
                width,
                height
            },
            cloud: {
                pixels: cloudPixels,
                width,
                height
            }
        };

        this.planetRenderer.init(
            width,
            height,
            diffusePixels,
            normalPixels,
            specularPixels,
            cloudPixels,
            this.config.normalScale
        );

        this.planetRenderer.setTexture(this.planetTexture);
        this.planetRenderer.updateTexture();

        this.planetRenderer.setNormalScale(this.config.normalScale);
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
