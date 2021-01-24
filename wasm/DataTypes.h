#pragma once
#include <wasm_simd128.h>

struct RGB {
    unsigned char r, g, b;
};

// Including a fake 4th value here permits the compiler to autovectorize better
typedef v128_t Point;
