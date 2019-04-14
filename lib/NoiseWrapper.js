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
        this.GetSimplex3 = (x, y, z) => mymod.getNoise(randomSeed, x, y, z);
        this.GetTexture = () => mymod.getBytes();
    };
}

export default WasmNoise;
