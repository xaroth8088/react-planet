#pragma once

struct RGB {
    unsigned char r, g, b;
};

// Including a fake 4th value here permits the compiler to autovectorize better
struct XYZ {
    float x, y, z, a;
};

// Including a fake 4th value here permits the compiler to autovectorize better
struct iXYZ {
    int x, y, z, a;
};
