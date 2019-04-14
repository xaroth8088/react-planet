import wasmInstantiate from './GenerateTexture';

class WasmNoise {
    init = async (seed) => {
        let randomSeed = seed;
        if (randomSeed === undefined) {
            randomSeed = Math.floor(Math.random() * 999999);
        }

        this.memory = new WebAssembly.Memory({ initial: 256 });

        const { instance } = await wasmInstantiate({
            env: {
                __table_base: 0,
                __memory_base: 0,
                memoryBase: 0,
                tableBase: 0,
                memory: this.memory,
                table: new WebAssembly.Table({
                    initial: 0,
                    element: 'anyfunc'
                })
            }
        });

        this.instance = instance;
        this.GetSimplex3 = this.instance.exports._getNoise;

        return this;
    };
}

export default WasmNoise;
