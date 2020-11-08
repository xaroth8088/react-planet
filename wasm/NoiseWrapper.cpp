#include "NoiseWrapper.h"
#include <algorithm>
#include <cmath>

NoiseWrapper::NoiseWrapper(float seed, float iScale, unsigned char iOctaves,
                           float iFalloff, float iIntensity,
                           float iRidginess, float sScale,
                           unsigned char sOctaves, float sFalloff,
                           float sIntensity)
    : iScale(iScale),
      iOctaves(iOctaves),
      iFalloff(iFalloff),
      iIntensity(iIntensity),
      iRidginess(iRidginess),
      sScale(sScale),
      sOctaves(sOctaves),
      sFalloff(sFalloff),
      sIntensity(sIntensity) {
    noise = new OpenSimplexNoise(seed);
};

NoiseWrapper::~NoiseWrapper() { delete noise; }

float NoiseWrapper::getOctave(float x, float y, float z,
                               unsigned char octaves) {
    float val = 0;
    float scale = 1;

    for (unsigned char i = 0; i < octaves; i++) {
        val += (0.5 + noise->Evaluate(x * scale, y * scale, z * scale)) / scale;
        scale *= 2.0;
    }

    return val;
}

float NoiseWrapper::getNormalizedOctave(float x, float y, float z,
                                         unsigned char octaves) {
    float q = 2.0 - (1.0 / (std::pow(2.0, (octaves - 1.0))));
    return getOctave(x, y, z, octaves) / q;
}

float NoiseWrapper::ridgify(float value) {
    return 1.0 - (2.0 * abs(value - 0.5));
}

float NoiseWrapper::sample(float x, float y, float z) {
    float offset = 0.0;

    if (sOctaves > 0) {
        offset = getOctave(x / sScale, y / sScale, z / sScale, sOctaves);

        offset = std::pow(offset, sFalloff);
        offset *= sIntensity;
    }

    float value = getNormalizedOctave(x / iScale + offset, y / iScale + offset,
                                       z / iScale + offset, iOctaves);

    if (iRidginess > 0.0) {
        float ridge =
            getNormalizedOctave(x / iScale + offset, y / iScale + offset,
                                z / iScale + offset + 11.0, iOctaves);

        value = iRidginess * ridgify(ridge) + (1.0 - iRidginess) * value;
    }

    value = std::pow(value, iFalloff);
    value = std::max(0.0f, std::min(1.0f, value * iIntensity));

    return value;
}
