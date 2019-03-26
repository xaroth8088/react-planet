export default class Noise {
    constructor(noiseFunc, params = {}) {
        this.getSimplexNoise3D = noiseFunc;

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

    static ridgify(val) {
        return 1 - 2 * Math.abs(val - 0.5);
    }

    noise(x, y, z) {
        const noiseVal = this.getSimplexNoise3D(x * 100, y * 100, z * 100);
        return (0.5 * noiseVal) + 0.5;
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
            val = this.iRidginess * Noise.ridgify(ridge) + (1 - this.iRidginess) * val;
        }
        val **= this.iFalloff;
        val = Math.max(0, Math.min(1, val * this.iIntensity));
        return val;
    }
}
