#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include "TextureGenerator.h"
#include "OpenSimplexNoise.h"
#include "NoiseWrapper.h"

using namespace OpenSimplexNoise;
using namespace emscripten;

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

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module) {
    function("sample", &sample);
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
    	.function("GenerateTextures", &TextureGenerator::GenerateTextures)
    	.function("getDiffuseTexture", &TextureGenerator::getDiffuseTexture)
    	.function("getNormalTexture", &TextureGenerator::getNormalTexture)
    	.function("getSpecularTexture", &TextureGenerator::getSpecularTexture)
    	.function("getCloudTexture", &TextureGenerator::getCloudTexture)
    	.property("resolution", &TextureGenerator::resolution); // TODO: remove this property from the interface
}
