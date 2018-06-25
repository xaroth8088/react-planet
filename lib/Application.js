import Alea from 'alea';
import PlanetRenderer from './PlanetRenderer';
import PlanetTexture from './PlanetTexture';
import Controls from './Controls';
import Noise from './Noise';
import Trackball from './Trackball';
import { datColor } from './Util';

export default class Application {
    constructor() {
        this.controls = new Controls(this);

        this.images = [];
        for (let i = 0; i < 4; i++) {
            const img = document.createElement('img');
            this.images.push(img);
            document.body.appendChild(img);
        }

        this.sprite = document.createElement('img');
        document.body.appendChild(this.sprite);

        this.planetTexture = null;
        this.planetRenderer = new PlanetRenderer();
        this.construct();

        window.addEventListener('resize', this.arrangeElements.bind(this), false);
    }

    deconstruct() {
        document.body.removeChild(this.planetTexture.diffuse.canvas);
        document.body.removeChild(this.planetTexture.normal.canvas);
        document.body.removeChild(this.planetTexture.specular.canvas);
        document.body.removeChild(this.planetTexture.cloud.canvas);
        this.trackball.release();
    }

    construct() {
        Math.random = Alea(this.controls.seed);
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

        console.log(this.controls.resolution);
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
        document.body.appendChild(this.planetRenderer.canvas);
        this.trackball = new Trackball(this.planetRenderer.canvas, this.planetRenderer.planet);
        this.hideImages();
        this.arrangeElements();
    }

    arrangeElements() {
        const textures = [
            this.planetTexture.diffuse.canvas,
            this.planetTexture.normal.canvas,
            this.planetTexture.specular.canvas,
            this.planetTexture.cloud.canvas
        ];
        for (let i = 0; i < 4; i++) {
            const q = textures[i];
            q.style.position = 'absolute';
            q.style.width = 256;
            q.style.height = 128;
            q.style.left = 16 + 245 + 16;
            q.style.top = 16 + 16 * i + 128 * i;
            const p = this.images[i];
            p.style.position = q.style.position;
            p.style.width = q.style.width;
            p.style.height = q.style.height;
            p.style.left = q.style.left;
            p.style.top = q.style.top;
        }

        this.sprite.style.position = 'absolute';
        this.sprite.style.left = 16 + 245 + 16;
        this.sprite.style.top = 16 + 16 * 4 + 128 * 4;
        this.sprite.style.width = 256;
        this.sprite.style.height = 256;

        const q = this.planetRenderer.canvas;
        q.style.position = 'fixed';
        const leftoverw = window.innerWidth - (245 + 256 + 16 * 2);
        const leftoverh = window.innerHeight;
        const size = Math.min(leftoverw - 32, leftoverh - 32);
        this.planetRenderer.setSize(size, size);
        q.style.top = 16;
        q.style.right = leftoverw / 2 - size / 2;

        document.body.style.height = 128 * 4 + 256 + 16 * 6;
    }

    showImages() {
        const textures = [
            this.planetTexture.diffuse.canvas,
            this.planetTexture.normal.canvas,
            this.planetTexture.specular.canvas,
            this.planetTexture.cloud.canvas
        ];
        for (let i = 0; i < 4; i++) {
            const q = textures[i];
            const p = this.images[i];
            q.style.display = 'none';
            p.style.display = 'block';
            p.src = q.toDataURL();
        }
    }

    hideImages() {
        const textures = [
            this.planetTexture.diffuse.canvas,
            this.planetTexture.normal.canvas,
            this.planetTexture.specular.canvas,
            this.planetTexture.cloud.canvas
        ];
        for (let i = 0; i < 4; i++) {
            const q = textures[i];
            const p = this.images[i];
            q.style.display = 'block';
            p.style.display = 'none';
        }
    }

    renderSprite() {
        this.sprite.src = this.planetRenderer.toDataURL(this.controls.spriteResolution,
            this.controls.spriteResolution);
    }

    update() {
        if (!this.planetTexture.done) {
            const t0 = Date.now();
            while (!this.planetTexture.done && Date.now() - t0 < 20) {
                this.planetTexture.update();
            }
            if (this.planetTexture.done) {
                this.planetRenderer.updateTexture();
                this.showImages();
                this.renderSprite();
            }
        }
        if (this.controls.animate) {
            this.planetRenderer.planetMesh.rotation.y += 0.001;
            this.planetRenderer.cloudMesh.rotation.y += 0.002;
        }
        this.planetRenderer.render();
        requestAnimationFrame(this.update.bind(this));
    }
}
