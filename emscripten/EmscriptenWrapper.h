#include <emscripten/bind.h>

#include "../wasm/TextureGenerator.h"

using namespace emscripten;

class EmscriptenWrapper {
   private:
    TextureGenerator* generator;

   public:
    EmscriptenWrapper(val options);

    void ParseOptions(val options);

    void GenerateTextures();
    val getDiffuseTexture();
    val getNormalTexture();
    val getSpecularTexture();
    val getCloudTexture();
};
