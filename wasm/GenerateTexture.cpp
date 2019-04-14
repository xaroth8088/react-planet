#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>

#include "OpenSimplexNoise.h"

using namespace OpenSimplexNoise;
using namespace emscripten;

unsigned char byteBuffer[3] = {0, 0, 0};
size_t bufferLength = sizeof(unsigned char) * 3;

double getNoise(double seed, double x, double y, double z) {
    Noise noise(seed);
    return noise.eval(x, y, z);
}

val EMSCRIPTEN_KEEPALIVE getBytes() {
    return val(typed_memory_view(bufferLength, byteBuffer));
}

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module) {
    function("getNoise", &getNoise);
    function("getBytes", &getBytes);
}
