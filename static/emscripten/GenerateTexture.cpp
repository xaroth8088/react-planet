#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "EmscriptenWrapper.h"

using namespace emscripten;

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module) {
    class_<EmscriptenWrapper>("TextureGenerator")
        .constructor<val>()
        .function("GenerateTextures", &EmscriptenWrapper::GenerateTextures)
        .function("getDiffuseTexture", &EmscriptenWrapper::getDiffuseTexture)
        .function("getNormalTexture", &EmscriptenWrapper::getNormalTexture)
        .function("getSpecularTexture", &EmscriptenWrapper::getSpecularTexture)
        .function("getCloudTexture", &EmscriptenWrapper::getCloudTexture);
}
