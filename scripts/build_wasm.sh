#!/usr/bin/env bash
source ../emsdk/emsdk_env.sh && emcc wasm/hello.c -s WASM=1 -s ENVIRONMENT=web -o build/hello.js
