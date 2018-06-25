import { randomRGB, randomSeed } from './Util';

export default class Controls {
    constructor(app) {
        this.app = app;
        this.seed = randomSeed();
        this.resolution = 512;
        this.spin = 1;

        this.surfaceiScale = 2;
        this.surfaceiOctaves = 8;
        this.surfaceiFalloff = 1;
        this.surfaceiIntensity = 1;
        this.surfaceiRidginess = 0.5;
        this.surfacesScale = 1;
        this.surfacesOctaves = 0;
        this.surfacesFalloff = 1;
        this.surfacesIntensity = 1;

        this.landColor1 = '#e6af7e';
        this.landColor2 = '#007200';
        this.landiScale = 2;
        this.landiOctaves = 1;
        this.landiFalloff = 1;
        this.landiIntensity = 1;
        this.landiRidginess = 0;
        this.landsScale = 2;
        this.landsOctaves = 0;
        this.landsFalloff = 1;
        this.landsIntensity = 1;

        this.waterDeep = '#000055';
        this.waterShallow = '#0000ff';
        this.waterLevel = 0.68;
        this.waterSpecular = 1;
        this.waterFalloff = 1;

        this.cloudColor = '#ffffff';
        this.cloudOpacity = 1;
        this.cloudiScale = 0.5;
        this.cloudiOctaves = 2;
        this.cloudiFalloff = 2;
        this.cloudiIntensity = 1.8;
        this.cloudiRidginess = 0;
        this.cloudsScale = 0.5;
        this.cloudsOctaves = 5;
        this.cloudsFalloff = 1;
        this.cloudsIntensity = 1;
        this.normalScale = 0.05;
        this.animate = true;
        this.spriteResolution = 512;
    }

    renderSprite() {
        this.app.renderSprite();
    }

    render() {
        this.app.deconstruct();
        this.app.construct();
    }

    randomizeSeed() {
        this.seed = randomSeed();
        this.render();
    }

    randomizeAll() {
        this.seed = randomSeed();
        this.spin = 1;
        if (Math.random() < 0.5) {
            this.spin = Math.random() * 7 + 1;
        }

        this.surfaceiScale = Math.random() * 2;
        this.surfaceiOctaves = Math.floor(Math.random() * 8 + 1);
        this.surfaceiFalloff = Math.random() * 3;
        this.surfaceiIntensity = Math.random() * 3;
        this.surfaceiRidginess = Math.random();
        this.surfacesScale = Math.random() * 2;
        this.surfacesOctaves = Math.floor(Math.random() * 8);
        this.surfacesFalloff = Math.random() * 3;
        this.surfacesIntensity = Math.random() * 3;

        this.landColor1 = randomRGB();
        this.landColor2 = randomRGB();
        this.landiScale = Math.random() * 2;
        this.landiOctaves = Math.floor(Math.random() * 8 + 1);
        this.landiFalloff = Math.random() * 3;
        this.landiIntensity = Math.random() * 3;
        this.landiRidginess = Math.random();
        this.landsScale = Math.random() * 2;
        this.landsOctaves = Math.floor(Math.random() * 8);
        this.landsFalloff = Math.random() * 3;
        this.landsIntensity = Math.random() * 3;

        this.waterDeep = randomRGB();
        this.waterShallow = randomRGB();
        this.waterLevel = 0;
        if (Math.random() < 0.5) {
            this.waterLevel = Math.random();
        }
        this.waterSpecular = Math.random();
        this.waterFalloff = Math.random() * 3;

        this.cloudColor = randomRGB();
        this.cloudOpacity = Math.random();
        this.cloudiScale = Math.random() * 2;
        this.cloudiOctaves = Math.floor(Math.random() * 8 + 1);

        this.cloudiFalloff = Math.random() * 3;
        this.cloudiIntensity = Math.random() * 3;
        this.cloudiRidginess = Math.random();
        this.cloudsScale = Math.random() * 2;
        this.cloudsOctaves = Math.floor(Math.random() * 8);

        this.cloudsFalloff = Math.random() * 3;
        this.cloudsIntensity = Math.random() * 3;
        this.normalScale = Math.random() * 0.3;
        this.render();
    }
}
