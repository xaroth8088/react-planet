#!/usr/bin/env bash
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
    -s BINARYEN_TRAP_MODE="'clamp'" \
    -s AGGRESSIVE_VARIABLE_ELIMINATION=1 \
    -s DOUBLE_MODE=1 \
    -s ERROR_ON_MISSING_LIBRARIES=1 \
    -fno-exceptions \
    -Os \
    -DEIGEN_MPL2_ONLY \
    --bind \
    -o wasm_build/GenerateTexture.mjs \
    wasm/GenerateTexture.cpp \
    wasm/OpenSimplexNoise.cpp \
    wasm/TextureGenerator.cpp \
    wasm/NoiseWrapper.cpp
cp wasm_build/GenerateTexture.mjs lib/GenerateTexture.js
