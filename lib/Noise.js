import Perlin from './Perlin';
import { randomSeed } from './Util';

export default class Noise {
    constructor(params = {}) {
        this.seed = params.seed || randomSeed();
        this.iScale = params.iScale || 1;
        this.iOctaves = params.iOctaves || 1;
        this.iFalloff = params.iFalloff || 1;
        this.iIntensity = params.iIntensity || 1;
        this.iRidginess = params.iRidginess || 0;
        this.sScale = params.sScale || 1;
        this.sOctaves = params.sOctaves || 0;
        this.sFalloff = params.sFalloff || 1;
        this.sIntensity = params.sIntensity || 1;
        this.perlin = new Perlin(this.seed);
        this.noise = this.perlin.noise;
    }

    octave(x, y, z, octaves) {
        let val = 0;
        let scale = 1;
        for (let i = 0; i < octaves; i++) {
            val += this.noise(x * scale, y * scale, z * scale) / scale;
            scale *= 2;
        }
        return val;
    }

    normalizedOctave(x, y, z, octaves) {
        const q = 2 - 1 / (2 ** (octaves - 1));
        return this.octave(x, y, z, octaves) / q;
    }

    ridgify(val) {
        return 1 - 2 * Math.abs(val - 0.5);
    }

    sample(x, y, z) {
        let offset = 0;
        if (this.sOctaves > 0) {
            offset = this.octave(x / this.sScale,
                y / this.sScale,
                z / this.sScale,
                this.sOctaves);
            offset **= this.sFalloff;
            offset *= this.sIntensity;
        }
        let val = this.normalizedOctave(x / this.iScale + offset,
            y / this.iScale + offset,
            z / this.iScale + offset,
            this.iOctaves);
        if (this.iRidginess > 0) {
            const ridge = this.normalizedOctave(x / this.iScale + offset,
                y / this.iScale + offset,
                z / this.iScale + offset + 11,
                this.iOctaves);
            val = this.iRidginess * this.ridgify(ridge) + (1 - this.iRidginess) * val;
        }
        val **= this.iFalloff;
        val = Math.max(0, Math.min(1, val * this.iIntensity));
        return val;
    }
}