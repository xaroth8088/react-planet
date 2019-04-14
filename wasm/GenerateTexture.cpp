#include <emscripten.h>
#include "OpenSimplexNoise.h"

using namespace OpenSimplexNoise;

extern "C" {
    double EMSCRIPTEN_KEEPALIVE getNoise(double seed, double x, double y, double z) {
        Noise noise(seed);
//        Noise noise;
        return noise.eval(x, y, z);
    }
}
