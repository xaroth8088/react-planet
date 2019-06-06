#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include "TextureGenerator.h"

using namespace emscripten;

/* Bindings */
EMSCRIPTEN_BINDINGS(my_module)
{
    class_<TextureGenerator>("TextureGenerator")
    .constructor<val>()
    .function("GenerateTextures", &TextureGenerator::GenerateTextures)
    .function("getDiffuseTexture", &TextureGenerator::getDiffuseTexture)
    .function("getNormalTexture", &TextureGenerator::getNormalTexture)
    .function("getSpecularTexture", &TextureGenerator::getSpecularTexture)
    .function("getCloudTexture", &TextureGenerator::getCloudTexture);
}
