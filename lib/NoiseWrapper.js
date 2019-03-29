/*
    Derived from https://github.com/Markyparky56/WasmNoise
    Used and modified under the terms of the MIT license
 */
import wasmInstantiate from './wasmnoise-0.4.3.opt';

class WasmNoise {
    loaded = false;

    Interp = Object.freeze({
        Linear: 0,
        Hermite: 1,
        Quintic: 2
    });

    FractalType = Object.freeze({
        FBM: 0,
        Billow: 1,
        RidgedMulti: 2
    });

    StripDirection = Object.freeze({
        XAxis: 0,
        YAxis: 1,
        ZAxis: 2,
        WAxis: 3
    });

    SquarePlane = Object.freeze({
        XYPlane: 0,
        XZPlane: 1,
        ZYPlane: 2,
        XWPlane: 3,
        YWPlane: 4,
        ZWPlane: 5
    });

    CellularDistanceFunction = Object.freeze({
        Euclidean: 0,
        Manhattan: 1,
        Natural: 2
    });

    CellularReturnType = Object.freeze({
        CellValue: 0,
        Distance: 1,
        Distance2: 2,
        Distance2Add: 3,
        Distance2Sub: 4,
        Distance2Mul: 5,
        Distance2Div: 6,
        NoiseLookupPerlin: 7,
        NoiseLookupSimplex: 8
    });

    init = async (seed) => {
        let randomSeed = seed;
        if (randomSeed === undefined) {
            randomSeed = Math.floor(Math.random() * 999999);
        }

        this.memory = new WebAssembly.Memory({ initial: 9 });

        const { instance } = await wasmInstantiate({
            env: {
                __errno_location() {
                    return 8;
                },
                abort() {
                    throw new Error('Abort called!');
                },
                sbrk: (len) => {
                    if (len >> 16 > 0) {
                        return (this.memory.grow(len >> 16) << 16); // eslint-disable-line no-bitwise
                    }

                    return 0;
                },
                memory: this.memory
            }
        });

        this.instance = instance;

        // Set up the functions exposed by the webasm module
        this.SetSeed = this.instance.exports.SetSeed;
        this.GetSeed = this.instance.exports.GetSeed;
        this.SetFrequency = this.instance.exports.SetFrequency;
        this.GetFrequency = this.instance.exports.GetFrequency;
        this.SetInterp = this.instance.exports.SetInterp;
        this.GetInterp = this.instance.exports.GetInterp;
        this.SetFractalOctaves = this.instance.exports.SetFractalOctaves;
        this.GetFractalOctaves = this.instance.exports.GetFractalOctaves;
        this.SetFractalLacunarity = this.instance.exports.SetFractalLacunarity;
        this.GetFractalLacunarity = this.instance.exports.GetFractalLacunarity;
        this.SetFractalGain = this.instance.exports.SetFractalGain;
        this.GetFractalGain = this.instance.exports.GetFractalGain;
        this.SetFractalType = this.instance.exports.SetFractalType;
        this.GetFractalType = this.instance.exports.GetFractalType;
        this.GetPerlin2 = this.instance.exports.GetPerlin2;
        this.GetPerlin2_Strip = this.instance.exports.GetPerlin2_Strip;
        this.GetPerlin2_Square = this.instance.exports.GetPerlin2_Square;
        this.GetPerlin3 = this.instance.exports.GetPerlin3;
        this.GetPerlin3_Strip = this.instance.exports.GetPerlin3_Strip;
        this.GetPerlin3_Square = this.instance.exports.GetPerlin3_Square;
        this.GetPerlin3_Cube = this.instance.exports.GetPerlin3_Cube;
        this.GetPerlinFractal2 = this.instance.exports.GetPerlinFractal2;
        this.GetPerlinFractal2_Strip = this.instance.exports.GetPerlinFractal2_Strip;
        this.GetPerlinFractal2_Square = this.instance.exports.GetPerlinFractal2_Square;
        this.GetPerlinFractal3 = this.instance.exports.GetPerlinFractal3;
        this.GetPerlinFractal3_Strip = this.instance.exports.GetPerlinFractal3_Strip;
        this.GetPerlinFractal3_Square = this.instance.exports.GetPerlinFractal3_Square;
        this.GetPerlinFractal3_Cube = this.instance.exports.GetPerlinFractal3_Cube;
        this.GetSimplex2 = this.instance.exports.GetSimplex2;
        this.GetSimplex2_Strip = this.instance.exports.GetSimplex2_Strip;
        this.GetSimplex2_Square = this.instance.exports.GetSimplex2_Square;
        this.GetSimplex3 = this.instance.exports.GetSimplex3;
        this.GetSimplex3_Strip = this.instance.exports.GetSimplex3_Strip;
        this.GetSimplex3_Square = this.instance.exports.GetSimplex3_Square;
        this.GetSimplex3_Cube = this.instance.exports.GetSimplex3_Cube;
        this.GetSimplex4 = this.instance.exports.GetSimplex4;
        this.GetSimplex4_Strip = this.instance.exports.GetSimplex4_Strip;
        this.GetSimplex4_Square = this.instance.exports.GetSimplex4_Square;
        this.GetSimplex4_Cube = this.instance.exports.GetSimplex4_Cube;
        this.GetSimplexFractal2 = this.instance.exports.GetSimplexFractal2;
        this.GetSimplexFractal2_Strip = this.instance.exports.GetSimplexFractal2_Strip;
        this.GetSimplexFractal2_Square = this.instance.exports.GetSimplexFractal2_Square;
        this.GetSimplexFractal3 = this.instance.exports.GetSimplexFractal3;
        this.GetSimplexFractal3_Strip = this.instance.exports.GetSimplexFractal3_Strip;
        this.GetSimplexFractal3_Square = this.instance.exports.GetSimplexFractal3_Square;
        this.GetSimplexFractal3_Cube = this.instance.exports.GetSimplexFractal3_Cube;
        this.GetSimplexFractal4 = this.instance.exports.GetSimplexFractal4;
        this.GetSimplexFractal4_Strip = this.instance.exports.GetSimplexFractal4_Strip;
        this.GetSimplexFractal4_Square = this.instance.exports.GetSimplexFractal4_Square;
        this.GetSimplexFractal4_Cube = this.instance.exports.GetSimplexFractal4_Cube;
        this.SetCellularDistanceFunction = this.instance.exports.SetCellularDistanceFunction;
        this.GetCellularDistanceFunction = this.instance.exports.GetCellularDistanceFunction;
        this.SetCellularReturnType = this.instance.exports.SetCellularReturnType;
        this.GetCellularReturnType = this.instance.exports.GetCellularReturnType;
        this.SetCellularDistance2Indices = this.instance.exports.SetCellularDistance2Indices;
        this.GetCellularDistanceIndex0 = this.instance.exports.GetCellularDistanceIndex0;
        this.GetCellularDistanceIndex1 = this.instance.exports.GetCellularDistanceIndex1;
        this.SetCellularJitter = this.instance.exports.SetCellularJitter;
        this.GetCellularJitter = this.instance.exports.GetCellularJitter;
        this.SetCellularNoiseLookupFrequency = this.instance.exports.SetCellularNoiseLookupFrequency;
        this.GetCellularNoiseLookupFrequency = this.instance.exports.GetCellularNoiseLookupFrequency;
        this.GetCellular2 = this.instance.exports.GetCellular2;
        this.GetCellular2_Strip = this.instance.exports.GetCellular2_Strip;
        this.GetCellular2_Square = this.instance.exports.GetCellular2_Square;
        this.GetCellular3 = this.instance.exports.GetCellular3;
        this.GetCellular3_Strip = this.instance.exports.GetCellular3_Strip;
        this.GetCellular3_Square = this.instance.exports.GetCellular3_Square;
        this.GetCellular3_Cube = this.instance.exports.GetCellular3_Cube;
        this.GetCellularFractal2 = this.instance.exports.GetCellularFractal2;
        this.GetCellularFractal2_Strip = this.instance.exports.GetCellularFractal2_Strip;
        this.GetCellularFractal2_Square = this.instance.exports.GetCellularFractal2_Square;
        this.GetCellularFractal3 = this.instance.exports.GetCellularFractal3;
        this.GetCellularFractal3_Strip = this.instance.exports.GetCellularFractal3_Strip;
        this.GetCellularFractal3_Square = this.instance.exports.GetCellularFractal3_Square;
        this.GetCellularFractal3_Cube = this.instance.exports.GetCellularFractal3_Cube;

        // Instantiate the object
        this.instance.exports['_GLOBAL__sub_I_WasmNoiseInterface.cpp']();
        this.instance.exports.SetSeed(randomSeed);

        return this;
    };

    GetPerlin2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetPerlin2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetPerlin2_Square_Values(startX, startY, width, height) {
        const offset = this.GetPerlin2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetPerlin3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetPerlin3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetPerlin3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetPerlin3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetPerlin3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetPerlin3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetPerlinFractal2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetPerlinFractal2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetPerlinFractal2_Square_Values(startX, startY, width, height) {
        const offset = this.GetPerlinFractal2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetPerlinFractal3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetPerlinFractal3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetPerlinFractal3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetPerlinFractal3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetPerlinFractal3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetPerlinFractal3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetSimplex2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetSimplex2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplex2_Square_Values(startX, startY, width, height) {
        const offset = this.GetSimplex2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplex3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetSimplex3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplex3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetSimplex3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplex3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetSimplex3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetSimplex4_Strip_Values(startX, startY, startZ, startW, length, direction) {
        const offset = this.GetSimplex4_Strip(startX, startY, startZ, startW, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplex4_Square_Values(startX, startY, startZ, startW, width, height, plane) {
        const offset = this.GetSimplex4_Square(startX, startY, startZ, startW, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplex4_Cube_Values(startX, startY, startZ, startW, width, height, depth) {
        const offset = this.GetSimplex4_Cube(startX, startY, startZ, startW, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetSimplexFractal2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetSimplexFractal2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplexFractal2_Square_Values(startX, startY, width, height) {
        const offset = this.GetSimplexFractal2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplexFractal3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetSimplexFractal3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplexFractal3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetSimplexFractal3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplexFractal3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetSimplexFractal3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetSimplexFractal4_Strip_Values(startX, startY, startZ, startW, length, direction) {
        const offset = this.GetSimplexFractal4_Strip(startX, startY, startZ, startW, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetSimplexFractal4_Square_Values(startX, startY, startZ, startW, width, height, plane) {
        const offset = this.GetSimplexFractal4_Square(startX, startY, startZ, startW, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetSimplexFractal4_Cube_Values(startX, startY, startZ, startW, width, height, depth) {
        const offset = this.GetSimplexFractal4_Cube(startX, startY, startZ, startW, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetCellular2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetCellular2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetCellular2_Square_Values(startX, startY, width, height) {
        const offset = this.GetCellular2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetCellular3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetCellular3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetCellular3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetCellular3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetCellular3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetCellular3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetCellularFractal2_Strip_Values(startX, startY, length, direction) {
        const offset = this.GetCellularFractal2_Strip(startX, startY, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetCellularFractal2_Square_Values(startX, startY, width, height) {
        const offset = this.GetCellularFractal2_Square(startX, startY, width, height);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetCellularFractal3_Strip_Values(startX, startY, startZ, length, direction) {
        const offset = this.GetCellularFractal3_Strip(startX, startY, startZ, length, direction);
        return new Float32Array(this.memory.buffer.slice(offset, offset + length * 4));
    }

    GetCellularFractal3_Square_Values(startX, startY, startZ, width, height, plane) {
        const offset = this.GetCellularFractal3_Square(startX, startY, startZ, width, height, plane);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * 4));
    }

    GetCellularFractal3_Cube_Values(startX, startY, startZ, width, height, depth) {
        const offset = this.GetCellularFractal3_Cube(startX, startY, startZ, width, height, depth);
        return new Float32Array(this.memory.buffer.slice(offset, offset + width * height * depth * 4));
    }

    GetValues(offset, elements) {
        return new Float32Array(this.memory.buffer.slice(offset, offset + (elements * 4)));
    }
}

export default WasmNoise;
