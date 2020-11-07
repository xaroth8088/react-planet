#!/usr/bin/env bash
cd "$(dirname "$0")/.."
mkdir -p wasm_build
source ../emsdk/emsdk_env.sh
emcc \
    -std=c++17 \
    -s WASM=1 \
    -s ENVIRONMENT="'web'" \
    -s ASSERTIONS=0 \
    -s INVOKE_RUN=0 \
    -s MALLOC="'emmalloc'" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FILESYSTEM=0 \
    -s EMIT_EMSCRIPTEN_METADATA=1 \
    -s STRICT=1 \
    -s SINGLE_FILE=1 \
    -s USE_ES6_IMPORT_META=0 \
    -s EXPORT_ES6=1 \
    -s MODULARIZE=1 \
    --no-entry \
    -msimd128 \
    -O3 \
    -fno-exceptions \
    --bind \
    -o wasm_build/GenerateTexture.js \
    emscripten/GenerateTexture.cpp \
    emscripten/EmscriptenWrapper.cpp \
    wasm/OpenSimplexNoise.cpp \
    wasm/TextureGenerator.cpp \
    wasm/NoiseWrapper.cpp
cp wasm_build/GenerateTexture.js lib/GenerateTexture.js
cp wasm_build/GenerateTexture.wasm.map demo-page/public/GenerateTexture.wasm.map

# For adding source maps
#    -g4 \
#    --source-map-base http://localhost:3000/ \
