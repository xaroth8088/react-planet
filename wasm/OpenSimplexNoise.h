#pragma once
/*******************************************************************************
 OpenSimplex Noise in C++
 Ported from https://gist.github.com/digitalshadow/134a3a02b67cecd72181
 Originally from https://gist.github.com/KdotJPG/b1270127455a94ac5d19
 Optimised by DigitalShadow
 Converted by Mark A. Ropper (Markyparky56)
 Modified by Geoff Benson (xaroth8088)
 Used under the UNLICENSE
 *******************************************************************************/
#include <array>
#include <memory>  // unique_ptr
#include <vector>
#include <wasm_simd128.h>

#if defined(__clang__)  // Couldn't find one for clang
#define FORCE_INLINE inline
#elif defined(__GNUC__) || defined(__GNUG__)
#define FORCE_INLINE __attribute__((always_inline))
#elif defined(_MSC_VER)
#define FORCE_INLINE __forceinline
#endif

class OpenSimplexNoise {
    friend class StaticConstructor;

   protected:
    // Contribution structs
    struct Contribution3 {
       public:
        float dx, dy, dz;
        int xsb, ysb, zsb;
        Contribution3 *Next;

        Contribution3(float multiplier, int _xsb, int _ysb, int _zsb)
            : xsb(_xsb), ysb(_ysb), zsb(_zsb), Next(nullptr) {
            dx = -xsb - multiplier * SQUISH_3D;
            dy = -ysb - multiplier * SQUISH_3D;
            dz = -zsb - multiplier * SQUISH_3D;
        }
        ~Contribution3() {
            if (Next != nullptr) {
                delete Next;
            }
        }
    };
    using pContribution3 = std::unique_ptr<Contribution3>;

    // Constants
    static const float STRETCH_3D;
    static const float SQUISH_3D;
    static const float NORM_3D;

    std::array<unsigned char, 256> perm;
    std::array<unsigned char, 256> perm3D;

    static std::array<float, 72> gradients3D;

    static std::vector<Contribution3 *> lookup3D;

    static std::vector<pContribution3> contributions3D;

    struct StaticConstructor {
        StaticConstructor() {
            gradients3D = {
                -11, 4,  4,   -4, 11, 4,   -4,  4,   11,  11, 4,   4,
                4,   11, 4,   4,  4,  11,  -11, -4,  4,   -4, -11, 4,
                -4,  -4, 11,  11, -4, 4,   4,   -11, 4,   4,  -4,  11,
                -11, 4,  -4,  -4, 11, -4,  -4,  4,   -11, 11, 4,   -4,
                4,   11, -4,  4,  4,  -11, -11, -4,  -4,  -4, -11, -4,
                -4,  -4, -11, 11, -4, -4,  4,   -11, -4,  4,  -4,  -11,
            };

            // Create Contribution3s for lookup3D
            std::vector<std::vector<int>> base3D = {
                {0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1},
                {2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 3, 1, 1, 1},
                {1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1,
                 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1}};
            std::vector<int> p3D = {
                0, 0, 1,  -1, 0,  0, 1, 0,  -1, 0, 0, -1, 1,  0,  0, 0,  1, -1,
                0, 0, -1, 0,  1,  0, 0, -1, 1,  0, 2, 1,  1,  0,  1, 1,  1, -1,
                0, 2, 1,  0,  1,  1, 1, -1, 1,  0, 2, 0,  1,  1,  1, -1, 1, 1,
                1, 3, 2,  1,  0,  3, 1, 2,  0,  1, 3, 2,  0,  1,  3, 1,  0, 2,
                1, 3, 0,  2,  1,  3, 0, 1,  2,  1, 1, 1,  0,  0,  2, 2,  0, 0,
                1, 1, 0,  1,  0,  2, 0, 2,  0,  1, 1, 0,  0,  1,  2, 0,  0, 2,
                2, 0, 0,  0,  0,  1, 1, -1, 1,  2, 0, 0,  0,  0,  1, -1, 1, 1,
                2, 0, 0,  0,  0,  1, 1, 1,  -1, 2, 3, 1,  1,  1,  2, 0,  0, 2,
                2, 3, 1,  1,  1,  2, 2, 0,  0,  2, 3, 1,  1,  1,  2, 0,  2, 0,
                2, 1, 1,  -1, 1,  2, 0, 0,  2,  2, 1, 1,  -1, 1,  2, 2,  0, 0,
                2, 1, -1, 1,  1,  2, 0, 0,  2,  2, 1, -1, 1,  1,  2, 0,  2, 0,
                2, 1, 1,  1,  -1, 2, 2, 0,  0,  2, 1, 1,  1,  -1, 2, 0,  2, 0};
            std::vector<int> lookupPairs3D = {
                0,    2,  1,    1,  2,    2,  5,    1,  6,    0,  7,    0,
                32,   2,  34,   2,  129,  1,  133,  1,  160,  5,  161,  5,
                518,  0,  519,  0,  546,  4,  550,  4,  645,  3,  647,  3,
                672,  5,  673,  5,  674,  4,  677,  3,  678,  4,  679,  3,
                680,  13, 681,  13, 682,  12, 685,  14, 686,  12, 687,  14,
                712,  20, 714,  18, 809,  21, 813,  23, 840,  20, 841,  21,
                1198, 19, 1199, 22, 1226, 18, 1230, 19, 1325, 23, 1327, 22,
                1352, 15, 1353, 17, 1354, 15, 1357, 17, 1358, 16, 1359, 16,
                1360, 11, 1361, 10, 1362, 11, 1365, 10, 1366, 9,  1367, 9,
                1392, 11, 1394, 11, 1489, 10, 1493, 10, 1520, 8,  1521, 8,
                1878, 9,  1879, 9,  1906, 7,  1910, 7,  2005, 6,  2007, 6,
                2032, 8,  2033, 8,  2034, 7,  2037, 6,  2038, 7,  2039, 6};

            contributions3D.resize(p3D.size() / 9);
            for (int i = 0; i < static_cast<int>(p3D.size()); i += 9) {
                auto baseSet = base3D[p3D[i]];
                Contribution3 *previous = nullptr, *current = nullptr;
                for (int k = 0; k < static_cast<int>(baseSet.size()); k += 4) {
                    current = new Contribution3(baseSet[k], baseSet[k + 1],
                                                baseSet[k + 2], baseSet[k + 3]);
                    if (previous == nullptr) {
                        contributions3D[i / 9] = pContribution3(current);
                    } else {
                        previous->Next = current;
                    }
                    previous = current;
                }
                current->Next = new Contribution3(p3D[i + 1], p3D[i + 2],
                                                  p3D[i + 3], p3D[i + 4]);
                current->Next->Next = new Contribution3(p3D[i + 5], p3D[i + 6],
                                                        p3D[i + 7], p3D[i + 8]);
            }

            lookup3D.resize(2048);
            for (int i = 0; i < static_cast<int>(lookupPairs3D.size());
                 i += 2) {
                lookup3D[lookupPairs3D[i]] =
                    contributions3D[lookupPairs3D[i + 1]].get();
            }
        }
    };
    static StaticConstructor staticConstructor;

    FORCE_INLINE static int FastFloor(float x) {
        int xi = static_cast<int>(x);
        return x < xi ? xi - 1 : xi;
    }

   public:
    OpenSimplexNoise(int64_t seed) {
        std::array<char, 256> source;
        for (int i = 0; i < 256; i++) {
            source[i] = i;
        }
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        for (int i = 255; i >= 0; i--) {
            seed = seed * 6364136223846793005L + 1442695040888963407L;
            int r = static_cast<int>((seed + 31) % (i + 1));
            if (r < 0) {
                r += (i + 1);
            }
            perm[i] = source[r];
            perm3D[i] = (perm[i] % 24) * 3;
            source[r] = source[i];
        }
    }

    float Evaluate(float x, float y, float z) {
        float stretchOffset = (x + y + z) * STRETCH_3D;

        v128_t pointSIMD = wasm_f32x4_make(x, y, z, 0);
        v128_t stretchOffsetSIMD = wasm_f32x4_splat(stretchOffset);
        v128_t stretchResult = wasm_f32x4_add(pointSIMD, stretchOffsetSIMD);

        // THIS SECTION SHOULD START WORKING AFTER CHROME 87
//        v128_t flooredStretch = __builtin_wasm_floor_f32x4(stretchResult);
//        int xsb = wasm_f32x4_extract_lane(flooredStretch, 0);
//        int ysb = wasm_f32x4_extract_lane(flooredStretch, 1);
//        int zsb = wasm_f32x4_extract_lane(flooredStretch, 2);
        // END SECTION

        // THIS SECTION CAN BE REPLACED WITH THE ABOVE AFTER CHROME 87
        float xs = wasm_f32x4_extract_lane(stretchResult, 0);
        float ys = wasm_f32x4_extract_lane(stretchResult, 1);
        float zs = wasm_f32x4_extract_lane(stretchResult, 2);

        int xsb = FastFloor(xs);
        int ysb = FastFloor(ys);
        int zsb = FastFloor(zs);

        v128_t flooredStretch = wasm_f32x4_make(xsb, ysb, zsb, 0);
        // END SECTION

        v128_t insResult = wasm_f32x4_sub(stretchResult, flooredStretch);

        float xins = wasm_f32x4_extract_lane(insResult, 0);
        float yins = wasm_f32x4_extract_lane(insResult, 1);
        float zins = wasm_f32x4_extract_lane(insResult, 2);

        float inSum = xins + yins + zins;
        int hash = static_cast<int>(yins - zins + 1) |
                   static_cast<int>(xins - yins + 1) << 1 |
                   static_cast<int>(xins - zins + 1) << 2 |
                   static_cast<int>(inSum) << 3 |
                   static_cast<int>(inSum + zins) << 5 |
                   static_cast<int>(inSum + yins) << 7 |
                   static_cast<int>(inSum + xins) << 9;

        Contribution3 *c = lookup3D[hash];

//        float dx0 = x - (xsb + squishOffset);
//        float dy0 = y - (ysb + squishOffset);
//        float dz0 = z - (zsb + squishOffset);
        float squishOffset = (xsb + ysb + zsb) * SQUISH_3D;
        v128_t squishOffsetSIMD = wasm_f32x4_splat(squishOffset);
        v128_t sbSIMD = wasm_f32x4_make(xsb, ysb, zsb, 0);
        v128_t dSIMDPartial = wasm_f32x4_sub(pointSIMD, sbSIMD);
        v128_t d0SIMD = wasm_f32x4_sub(dSIMDPartial, squishOffsetSIMD);

        float value = 0.0;
        while (c != nullptr) {
//            float dx = dx0 + c->dx;
//            float dy = dy0 + c->dy;
//            float dz = dz0 + c->dz;
            v128_t cdSIMD = wasm_f32x4_make(c->dx, c->dy, c->dz, 0);
            v128_t dSIMD = wasm_f32x4_add(d0SIMD, cdSIMD);

            float dx = wasm_f32x4_extract_lane(dSIMD, 0);
            float dy = wasm_f32x4_extract_lane(dSIMD, 1);
            float dz = wasm_f32x4_extract_lane(dSIMD, 2);

            float attn = 2 - dx * dx - dy * dy - dz * dz;
            if (attn > 0) {
//                int px = xsb + c->xsb;
//                int py = ysb + c->ysb;
//                int pz = zsb + c->zsb;
                v128_t csbSIMD = wasm_f32x4_make(c->xsb, c->ysb, c->zsb, 0);
                v128_t pSIMD = wasm_f32x4_add(sbSIMD, csbSIMD);
                int px = wasm_f32x4_extract_lane(pSIMD, 0);
                int py = wasm_f32x4_extract_lane(pSIMD, 1);
                int pz = wasm_f32x4_extract_lane(pSIMD, 2);

                int i = perm3D[(perm[(perm[px & 0xFF] + py) & 0xFF] + pz) & 0xFF];

//                float valuePart = gradients3D[i] * dx +
//                                   gradients3D[i + 1] * dy +
//                                   gradients3D[i + 2] * dz;
                v128_t gradients3DSIMD = wasm_f32x4_make(gradients3D[i], gradients3D[i + 1], gradients3D[i + 2], 0);
                v128_t dGradients3D = wasm_f32x4_mul(gradients3DSIMD, dSIMD);
                float valuePart = wasm_f32x4_extract_lane(dGradients3D, 0)
                                  + wasm_f32x4_extract_lane(dGradients3D, 1)
                                  + wasm_f32x4_extract_lane(dGradients3D, 2);

                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c->Next;
        }

        return value * NORM_3D;
    }
};
