import wasmInstantiate from './GenerateTexture';

class WasmNoise {
    init = async (seed) => {
        let randomSeed = seed;
        if (randomSeed === undefined) {
            randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }

        console.log(`seed: ${randomSeed}`);

        const { instance } = await wasmInstantiate({
            env: {
                __table_base: 0,
                __memory_base: 0,
                memoryBase: 0,
                tableBase: 0,
                memory: new WebAssembly.Memory({ initial: 256 }),
                table: new WebAssembly.Table({
                    initial: 0,
                    element: 'anyfunc'
                })
            }
        });

        this.instance = instance;
        this.GetSimplex3 = (x, y, z) => {
            return this.instance.exports._getNoise(randomSeed, x, y, z);
        };

        return this;
    };
}

export default WasmNoise;
