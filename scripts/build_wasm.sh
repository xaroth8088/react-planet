#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
mkdir -p wasm_build
rm wasm_build/*

source ../emsdk/emsdk_env.sh
em++ \
    -s WASM=1 \
    -s ENVIRONMENT=web \
    -s ASSERTIONS=0 \
    -s MALLOC=emmalloc \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FILESYSTEM=0 \
    -s EMIT_EMSCRIPTEN_METADATA=1 \
    -s STRICT=1 \
    -s SINGLE_FILE=1 \
    -s USE_ES6_IMPORT_META=0 \
    -s EXPORT_ES6=1 \
    -s MODULARIZE=1 \
    -s INVOKE_RUN=0 \
    --no-entry \
    -std=c++20 \
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

# To enable debugging via the demo page...
#    -s SINGLE_FILE=0 \
#    -g4 \
#    --source-map-base /react-planet/static/js/ \
#
#mkdir -p demo-page/public/static/js
#cp -R emscripten demo-page/public/static/
#cp -R wasm demo-page/public/static/
#cp wasm_build/GenerateTexture.wasm demo-page/public/static/js/GenerateTexture.wasm
#cp wasm_build/GenerateTexture.wasm.map demo-page/public/static/js/GenerateTexture.wasm.map
