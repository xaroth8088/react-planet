#include <cmath>
#include <algorithm>
#include "NoiseWrapper.h"

NoiseWrapper::NoiseWrapper(
    double seed,
    double iScale,
    unsigned char iOctaves,
    double iFalloff,
    double iIntensity,
    double iRidginess,
    double sScale,
    unsigned char sOctaves,
    double sFalloff,
    double sIntensity
)
    :
        iScale(iScale),
        iOctaves(iOctaves),
        iFalloff(iFalloff),
        iIntensity(iIntensity),
        iRidginess(iRidginess),
        sScale(sScale),
        sOctaves(sOctaves),
        sFalloff(sFalloff),
        sIntensity(sIntensity)
    {
        this->noise = new Noise(seed);
    };

double NoiseWrapper::getNoise(double x, double y, double z) {
    return this->noise->eval(x, y, z);
}

double NoiseWrapper::getScaledNoise(double x, double y, double z) {
    return 0.5 + (
        this->getNoise(x, y, z)
    );
}

double NoiseWrapper::getOctave(double x, double y, double z, unsigned char octaves) {
    double val = 0;
    double scale = 1;

    for (unsigned char i = 0; i < octaves; i++) {
        val += this->getScaledNoise(x * scale, y * scale, z * scale) / scale;
        scale *= 2.0;
    }

    return val;
}

double NoiseWrapper::getNormalizedOctave(double x, double y, double z, unsigned char octaves) {
    double q = 2.0 - ( 1.0 / (std::pow(2.0, (octaves - 1.0))) );
    return this->getOctave(x, y, z, octaves) / q;
}

double NoiseWrapper::ridgify(double value) {
    return 1.0 - (2.0 * abs(value - 0.5));
}

double NoiseWrapper::sample(
    double x,
    double y,
    double z
)
{
    double offset = 0.0;

    if (this->sOctaves > 0) {
        offset = this->getOctave(
            x / this->sScale,
            y / this->sScale,
            z / this->sScale,
            this->sOctaves
        );

        offset = std::pow( offset, this->sFalloff );
        offset *= this->sIntensity;
    }

    double value = this->getNormalizedOctave(
        x / this->iScale + offset,
        y / this->iScale + offset,
        z / this->iScale + offset,
        this->iOctaves
    );

    if (this->iRidginess > 0.0) {
        double ridge = this->getNormalizedOctave(
            x / this->iScale + offset,
            y / this->iScale + offset,
            z / this->iScale + offset + 11.0,
            this->iOctaves
        );

        value = this->iRidginess * this->ridgify(ridge) + (1.0 - this->iRidginess) * value;
    }

    value = std::pow( value, iFalloff );
    value = std::max(0.0, std::min(1.0, value * iIntensity));

    return value;
}
