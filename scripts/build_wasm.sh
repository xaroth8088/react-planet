#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
mkdir -p wasm_build
rm wasm_build/*
export NODE=''

source ../emsdk/emsdk_env.sh
em++ \
    -s ENVIRONMENT=worker \
    -s STRICT=1 \
    -s WASM=1 \
    -s ASSERTIONS=0 \
    -s MALLOC=emmalloc \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FILESYSTEM=0 \
    -s SINGLE_FILE=1 \
    -s EXPORT_ES6=1 \
    -s MODULARIZE=1 \
    -s WASM_ASYNC_COMPILATION=0 \
    -s INVOKE_RUN=0 \
    -s INCOMING_MODULE_JS_API=[] \
    -s WASM_BIGINT=1 \
    -s TEXTDECODER=2 \
    -s SUPPORT_ERRNO=0 \
    --closure 1 \
    -s EXPORT_NAME=GenerateTextureModule \
    -pthread \
    --no-entry \
    -std=c++20 \
    -msimd128 \
    -O3 \
    -fno-exceptions \
    -flto \
    --bind \
    -o wasm_build/GenerateTexture.js \
    emscripten/GenerateTexture.cpp \
    emscripten/EmscriptenWrapper.cpp \
    wasm/OpenSimplexNoise.cpp \
    wasm/TextureGenerator.cpp \
    wasm/NoiseWrapper.cpp
cp wasm_build/GenerateTexture.js lib/GenerateTexture.js
cp wasm_build/GenerateTexture.worker.js lib/GenerateTexture.worker.js
mkdir -p demo-page/public/static/js
cp wasm_build/GenerateTexture.wasm demo-page/public/static/js/GenerateTexture.wasm
cp wasm_build/GenerateTexture.worker.js demo-page/public/static/js/GenerateTexture.worker.js

# To enable debugging via the demo page...
#    -s SINGLE_FILE=0 \
#    -g4 \
#    --source-map-base /react-planet/static/js/ \
#
#cp -R emscripten demo-page/public/static/
#cp -R wasm demo-page/public/static/
#cp wasm_build/GenerateTexture.wasm.map demo-page/public/static/js/GenerateTexture.wasm.map
