export default class Noise {
    constructor(noiseWrapper, params = {}) {
        this.noiseWrapper = noiseWrapper;

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

    sample(x, y, z) {
        return this.noiseWrapper.sample(
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
    }
}
