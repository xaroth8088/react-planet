#include <iostream>
#include <emscripten.h>
#include "OpenSimplexNoise.h"

using namespace OpenSimplexNoise;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    float test() {
        Noise noise;
        return (float)(noise.eval(0.13, 0.31));
    }
}
