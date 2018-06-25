import PlanetRenderer from './PlanetRenderer';
import PlanetTexture from './PlanetTexture';
import Controls from './Controls';
import Noise from './Noise';
import { datColor } from './Util';

export default class Application {
    constructor(element) {
        this.element = element;
        this.controls = new Controls(this);

        this.planetTexture = null;
        this.planetRenderer = new PlanetRenderer();
        this.construct();
    }

    construct() {
        const surfaceNoise = new Noise({
            iScale: this.controls.surfaceiScale,
            iOctaves: this.controls.surfaceiOctaves,
            iFalloff: this.controls.surfaceiFalloff,
            iIntensity: this.controls.surfaceiIntensity,
            iRidginess: this.controls.surfaceiRidginess,
            sScale: this.controls.surfacesScale,
            sOctaves: this.controls.surfacesOctaves,
            sFalloff: this.controls.surfacesFalloff,
            sIntensity: this.controls.surfacesIntensity
        });
        const landNoise = new Noise({
            iScale: this.controls.landiScale,
            iOctaves: this.controls.landiOctaves,
            iFalloff: this.controls.landiFalloff,
            iIntensity: this.controls.landiIntensity,
            iRidginess: this.controls.landiRidginess,
            sScale: this.controls.landsScale,
            sOctaves: this.controls.landsOctaves,
            sFalloff: this.controls.landsFalloff,
            sIntensity: this.controls.landsIntensity
        });
        const cloudNoise = new Noise({
            iScale: this.controls.cloudiScale,
            iOctaves: this.controls.cloudiOctaves,
            iFalloff: this.controls.cloudiFalloff,
            iIntensity: this.controls.cloudiIntensity,
            iRidginess: this.controls.cloudiRidginess,
            sScale: this.controls.cloudsScale,
            sOctaves: this.controls.cloudsOctaves,
            sFalloff: this.controls.cloudsFalloff,
            sIntensity: this.controls.cloudsIntensity
        });

        this.planetTexture = new PlanetTexture({
            width: parseInt(this.controls.resolution, 10),
            waterDeep: datColor(this.controls.waterDeep),
            waterShallow: datColor(this.controls.waterShallow),
            waterLevel: this.controls.waterLevel,
            waterSpecular: this.controls.waterSpecular,
            waterFalloff: this.controls.waterFalloff,
            surfaceNoise,
            landColor1: datColor(this.controls.landColor1),
            landColor2: datColor(this.controls.landColor2),
            landNoise,
            cloudColor: datColor(this.controls.cloudColor),
            cloudOpacity: this.controls.cloudOpacity,
            cloudNoise,
            spin: this.controls.spin
        });
        this.planetRenderer.setTexture(this.planetTexture);
        this.planetRenderer.setNormalScale(this.controls.normalScale);
        this.element.appendChild(this.planetRenderer.canvas);
        const size = this.element.clientWidth;
        this.planetRenderer.setSize(size, size);
    }

    update() {
        if (!this.planetTexture.done) {
            const t0 = Date.now();
            while (!this.planetTexture.done && Date.now() - t0 < 100) { // TODO: make the time-per-tick configurable
                this.planetTexture.update();
                this.planetRenderer.updateTexture(); // TODO: make this line a toggle (i.e. draw in vs. wait until done)
            }
            if (this.planetTexture.done) {
                this.planetRenderer.updateTexture();
            }
        }
        if (this.controls.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001;
            this.planetRenderer.cloudMesh.rotation.y += 0.002;
        }
        this.planetRenderer.render();
        // TODO: Can we have this animation handled by Three.js natively, instead of doing it ourselves?
        requestAnimationFrame(this.update.bind(this));
    }
}
