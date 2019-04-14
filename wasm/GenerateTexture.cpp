#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <cmath>
#include <algorithm>

#include "OpenSimplexNoise.h"

using namespace OpenSimplexNoise;
using namespace emscripten;

unsigned char byteBuffer[3] = {0, 0, 0};
size_t bufferLength = sizeof(unsigned char) * 3;

Noise* noise = nullptr;

double getNoise(double seed, double x, double y, double z) {
    if (noise == nullptr) {
        noise = new Noise(seed);
    }

    return noise->eval(x, y, z);
}

val EMSCRIPTEN_KEEPALIVE getTexture() {
    return val(typed_memory_view(bufferLength, byteBuffer));
}

double EMSCRIPTEN_KEEPALIVE getScaledNoise(double seed, double x, double y, double z) {
    return 0.5 + (
        getNoise(seed, x, y, z)
    );
}

double EMSCRIPTEN_KEEPALIVE getOctave(double seed, double x, double y, double z, unsigned short int octaves) {
    double val = 0;
    double scale = 1;

    for (unsigned short int i = 0; i < octaves; i++) {
        val += getScaledNoise(seed, x * scale, y * scale, z * scale) / scale;
        scale *= 2.0;
    }

    return val;
}

double EMSCRIPTEN_KEEPALIVE getNormalizedOctave(double seed, double x, double y, double z, unsigned short int octaves) {
    double q = 2.0 - ( 1.0 / (std::pow(2.0, (octaves - 1.0))) );
    return getOctave(seed, x, y, z, octaves) / q;
}

double EMSCRIPTEN_KEEPALIVE ridgify(double value) {
    return 1.0 - (2.0 * abs(value - 0.5));
}

double EMSCRIPTEN_KEEPALIVE sample(
    double seed,
    double x,
    double y,
    double z,
    double iScale,
    double iOctaves,
    double iFalloff,
    double iIntensity,
    double iRidginess,
    double sScale,
    unsigned short int sOctaves,
    double sFalloff,
    double sIntensity
) {
    double offset = 0.0;

    if (sOctaves > 0.0) {
        offset = getOctave(
            seed,
            x / sScale,
            y / sScale,
            z / sScale,
            sOctaves
        );

        offset = std::pow( offset, sFalloff );
        offset *= sIntensity;
    }

    double value = getNormalizedOctave(
        seed,
        x / iScale + offset,
        y / iScale + offset,
        z / iScale + offset,
        iOctaves
    );

    if (iRidginess > 0.0) {
        double ridge = getNormalizedOctave(
            seed,
            x / iScale + offset,
            y / iScale + offset,
            z / iScale + offset + 11.0,
            iOctaves
        );

        value = iRidginess * ridgify(ridge) + (1.0 - iRidginess) * value;
    }

    value = std::pow( value, iFalloff );
    value = std::max(0.0, std::min(1.0, value * iIntensity));

    return value;
}

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module) {
    function("sample", &sample);
    function("getTexture", &getTexture);
}
