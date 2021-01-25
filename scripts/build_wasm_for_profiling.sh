#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
mkdir -p wasm_build
rm wasm_build/*
cd wasm_build || exit

source ../../emsdk/emsdk_env.sh
em++ \
    -s STRICT=1 \
    -s ENVIRONMENT=web,worker \
    -s ASSERTIONS=1 \
    -s MALLOC=emmalloc \
    -s FILESYSTEM=0 \
    -s USE_ES6_IMPORT_META=0 \
    -s INITIAL_MEMORY=256mb \
    -s ALLOW_BLOCKING_ON_MAIN_THREAD=0 \
    -s EXPORT_NAME=GenerateTextureModule \
    -s PTHREAD_POOL_SIZE=8 \
    -pthread \
    -std=c++20 \
    -msimd128 \
    --bind \
    -O3 \
    ../emscripten/GenerateTexture.cpp \
    ../emscripten/EmscriptenWrapper.cpp \
    ../wasm/OpenSimplexNoise.cpp \
    ../wasm/TextureGenerator.cpp \
    ../wasm/NoiseWrapper.cpp \
    ../main.cpp
