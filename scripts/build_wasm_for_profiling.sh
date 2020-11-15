#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
mkdir -p wasm_build
rm wasm_build/*
cd wasm_build || exit

source ../../emsdk/emsdk_env.sh
em++ \
    -s STRICT=1 \
    -s WASM=1 \
    -s ASSERTIONS=0 \
    -s MALLOC=emmalloc \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FILESYSTEM=0 \
    -s EMIT_EMSCRIPTEN_METADATA=1 \
    -s USE_ES6_IMPORT_META=0 \
    -std=c++20 \
    --bind \
    -O3 \
    ../emscripten/GenerateTexture.cpp \
    ../emscripten/EmscriptenWrapper.cpp \
    ../wasm/OpenSimplexNoise.cpp \
    ../wasm/TextureGenerator.cpp \
    ../wasm/NoiseWrapper.cpp \
    ../main.cpp
