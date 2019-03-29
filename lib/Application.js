import Noise from './Noise';
import WasmNoise from './NoiseWrapper';
import PlanetRenderer from './PlanetRenderer';
import PlanetTexture from './PlanetTexture';
import { datColor } from './Util';

export default class Application {
    constructor(element, config) {
        this.element = element;
        this.config = config;

        this.planetTexture = null;
        this.planetRenderer = new PlanetRenderer();
    }

    async init() {
        const noiseGenerator = new WasmNoise();
        await noiseGenerator.init();

        const surfaceNoise = new Noise(
            noiseGenerator.GetSimplex3,
            {
                iScale: this.config.surfaceiScale,
                iOctaves: this.config.surfaceiOctaves,
                iFalloff: this.config.surfaceiFalloff,
                iIntensity: this.config.surfaceiIntensity,
                iRidginess: this.config.surfaceiRidginess,
                sScale: this.config.surfacesScale,
                sOctaves: this.config.surfacesOctaves,
                sFalloff: this.config.surfacesFalloff,
                sIntensity: this.config.surfacesIntensity
            }
        );

        const landNoise = new Noise(
            noiseGenerator.GetSimplex3,
            {
                iScale: this.config.landiScale,
                iOctaves: this.config.landiOctaves,
                iFalloff: this.config.landiFalloff,
                iIntensity: this.config.landiIntensity,
                iRidginess: this.config.landiRidginess,
                sScale: this.config.landsScale,
                sOctaves: this.config.landsOctaves,
                sFalloff: this.config.landsFalloff,
                sIntensity: this.config.landsIntensity
            }
        );

        const cloudNoise = new Noise(
            noiseGenerator.GetSimplex3,
            {
                iScale: this.config.cloudiScale,
                iOctaves: this.config.cloudiOctaves,
                iFalloff: this.config.cloudiFalloff,
                iIntensity: this.config.cloudiIntensity,
                iRidginess: this.config.cloudiRidginess,
                sScale: this.config.cloudsScale,
                sOctaves: this.config.cloudsOctaves,
                sFalloff: this.config.cloudsFalloff,
                sIntensity: this.config.cloudsIntensity
            }
        );

        this.planetTexture = new PlanetTexture({
            width: parseInt(this.config.resolution, 10),
            waterDeep: datColor(this.config.waterDeep),
            waterShallow: datColor(this.config.waterShallow),
            waterLevel: this.config.waterLevel,
            waterSpecular: this.config.waterSpecular,
            waterFalloff: this.config.waterFalloff,
            surfaceNoise,
            landColor1: datColor(this.config.landColor1),
            landColor2: datColor(this.config.landColor2),
            landNoise,
            cloudColor: datColor(this.config.cloudColor),
            cloudOpacity: this.config.cloudOpacity,
            cloudNoise,
            spin: this.config.spin
        });

        this.planetRenderer.setTexture(this.planetTexture);
        this.planetRenderer.setNormalScale(this.config.normalScale);
        this.element.appendChild(this.planetRenderer.canvas);
        const size = this.element.clientWidth;
        this.planetRenderer.setSize(size, size);
    }

    update = () => {
        if (!this.planetTexture.done) {
            // Generating the textures can be time-consuming.  To avoid locking the UI, we'll break the work into chunks
            // TODO: explore having a web worker do this instead, so that it doesn't need to worry about blocking the UI
            const t0 = performance.now();
            while (!this.planetTexture.done && performance.now() - t0 < 250) { // TODO: make the time-per-tick configurable
                this.planetTexture.update();
                this.planetRenderer.updateTexture(); // TODO: make this line a toggle (i.e. draw in vs. wait until done)
            }

            // Did we finish during this work unit?
            if (this.planetTexture.done) {
                this.planetRenderer.updateTexture();
                this.planetTexture.releaseNoiseGenerators();
            }
        }

        if (this.config.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001; // TODO: make this speed a param
            this.planetRenderer.cloudMesh.rotation.y += 0.002; // TODO: make this speed a param
        }

        this.planetRenderer.render();
        requestAnimationFrame(this.update);
    };
}
