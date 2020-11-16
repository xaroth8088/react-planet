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

float NoiseWrapper::getOctave(XYZ p0, unsigned char octaves) {
    float val = 0;
    float scale = 1;
    XYZ p;

    for (unsigned char i = 0; i < octaves; i++) {
        p.x = p0.x * scale;
        p.y = p0.y * scale;
        p.z = p0.z * scale;

        val += (0.5 + noise->Evaluate(p)) / scale;
        scale *= 2.0;
    }

    return val;
}

float NoiseWrapper::getNormalizedOctave(XYZ p0, unsigned char octaves) {
    float q = 2.0 - (1.0 / (std::pow(2.0, (octaves - 1.0))));
    return getOctave(p0, octaves) / q;
}

float NoiseWrapper::ridgify(float value) {
    return 1.0 - (2.0 * abs(value - 0.5));
}

float NoiseWrapper::sample(XYZ p0) {
    float offset = 0.0;
    XYZ p;
    p.x = p0.x / sScale;
    p.y = p0.y / sScale;
    p.z = p0.z / sScale;

    if (sOctaves > 0) {
        offset = getOctave( p, sOctaves );

        offset = std::pow(offset, sFalloff);
        offset *= sIntensity;
    }

    p.x = p0.x / iScale + offset;
    p.y = p0.y / iScale + offset;
    p.z = p0.z / iScale + offset;

    float value = getNormalizedOctave( p, iOctaves );

    if (iRidginess > 0.0) {
        p.x = p0.x / iScale + offset;
        p.y = p0.y / iScale + offset;
        p.z = p0.z / iScale + offset + 11.0f;
        float ridge = getNormalizedOctave( p, iOctaves );

        value = iRidginess * ridgify(ridge) + (1.0 - iRidginess) * value;
    }

    value = std::pow(value, iFalloff);
    value = std::max(0.0f, std::min(1.0f, value * iIntensity));

    return value;
}
