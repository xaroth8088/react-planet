import GenerateTexture from './GenerateTexture';

function loadModule() {
    return new Promise((resolve) => {
        GenerateTexture().then((mod) => {
            mod.then = null; // eslint-disable-line no-param-reassign
            resolve(mod);
        });
    });
}

export default class Noise {
    constructor(params = {}) {
        this.iScale = params.iScale || 1;
        this.iOctaves = params.iOctaves || 1;
        this.iFalloff = params.iFalloff || 1;
        this.iIntensity = params.iIntensity || 1;
        this.iRidginess = params.iRidginess || 0;
        this.sScale = params.sScale || 1;
        this.sOctaves = params.sOctaves || 0;
        this.sFalloff = params.sFalloff || 1;
        this.sIntensity = params.sIntensity || 1;
    }

    init = async (seed, resolution) => {
        let randomSeed = seed;
        if (randomSeed === undefined) {
            randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }

        const mymod = await loadModule();
        this.temp = new mymod.TextureGenerator({ resolution });
        this.temp.GenerateTextures();
        this.diffusePixels = this.temp.getDiffuseTexture();
        this.normalPixels = this.temp.getNormalTexture();
        this.specularPixels = this.temp.getSpecularTexture();
        this.cloudPixels = this.temp.getCloudTexture();

        this.sample = (
            x,
            y,
            z,
        ) => mymod.sample(
            randomSeed,
            x,
            y,
            z,
            this.iScale,
            this.iOctaves,
            this.iFalloff,
            this.iIntensity,
            this.iRidginess,
            this.sScale,
            this.sOctaves,
            this.sFalloff,
            this.sIntensity
        );
    };
}
