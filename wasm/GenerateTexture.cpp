#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include "TextureGenerator.h"
#include "OpenSimplexNoise.h"
#include "NoiseWrapper.h"

using namespace OpenSimplexNoise;
using namespace emscripten;

unsigned char byteBuffer[3] = {0, 0, 0};
size_t bufferLength = sizeof(unsigned char) * 3;

NoiseWrapper* noise = nullptr;

double EMSCRIPTEN_KEEPALIVE sample(
    double seed,
    double x,
    double y,
    double z,
    double iScale,
    unsigned char iOctaves,
    double iFalloff,
    double iIntensity,
    double iRidginess,
    double sScale,
    unsigned char sOctaves,
    double sFalloff,
    double sIntensity
) {
    if (noise == nullptr) {
        noise = new NoiseWrapper(
            seed,
            iScale,
            iOctaves,
            iFalloff,
            iIntensity,
            iRidginess,
            sScale,
            sOctaves,
            sFalloff,
            sIntensity
        );
    }

    return noise->sample(x, y, z);
}

val EMSCRIPTEN_KEEPALIVE getTexture() {
    return val(typed_memory_view(bufferLength, byteBuffer));
}

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module) {
    function("sample", &sample);
    function("getTexture", &getTexture);
    class_<NoiseWrapper>("NoiseWrapper")
        .constructor<
            double,
            double,
            unsigned char,
            double,
            double,
            double,
            double,
            unsigned char,
            double,
            double
        >()
        .function("sample", &NoiseWrapper::sample);
	class_<TextureGenerator>("TextureGenerator")
    	.constructor<val>()
    	.property("spin", &TextureGenerator::spin); // TODO: remove this property from the interface
}
