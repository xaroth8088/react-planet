#!/usr/bin/env bash
mkdir -p build
source ../emsdk/emsdk_env.sh
emcc wasm/GenerateTexture.cpp wasm/OpenSimplexNoise.cpp \
    -std=c++17 \
    -s WASM=1 \
    -s ENVIRONMENT=web \
    -s ASSERTIONS=0 \
    -s INVOKE_RUN=0 \
    -s MALLOC='emmalloc' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FILESYSTEM=0 \
    -s SIDE_MODULE=1 \
    -s EMIT_EMSCRIPTEN_METADATA=1 \
    -s DEFAULT_LIBRARY_FUNCS_TO_INCLUDE="['_memcpy','_memset','_malloc','_free','_strlen']" \
    -s EXTRA_EXPORTED_RUNTIME_METHODS="['getTempRet0']" \
    -fno-exceptions \
    -Os \
    -o build/GenerateTexture.wasm
cp build/GenerateTexture.wasm lib/GenerateTexture.wsm
