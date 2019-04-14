import GenerateTexture from './GenerateTexture';

function loadModule() {
    return new Promise((resolve) => {
        GenerateTexture().then((mod) => {
            mod.then = null; // eslint-disable-line no-param-reassign
            resolve(mod);
        });
    });
}

class WasmNoise {
    init = async (seed) => {
        let randomSeed = seed;
        if (randomSeed === undefined) {
            randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }

        const mymod = await loadModule();
        this.sample = (
            x,
            y,
            z,
            iScale,
            iOctaves,
            iFalloff,
            iIntensity,
            iRidginess,
            sScale,
            sOctaves,
            sFalloff,
            sIntensity
        ) => mymod.sample(
            randomSeed,
            x,
            y,
            z,
            iScale,
            iOctaves,
            iFalloff,
            iIntensity,
            iRidginess,
            sScale,
            sOctaves,
            sFalloff,
            sIntensity
        );
        this.getTexture = () => mymod.getTexture();
    };
}

export default WasmNoise;
