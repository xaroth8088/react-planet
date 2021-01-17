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
#include <math.h>
#include <iostream>
#include <wasm_simd128.h>

#include "DataTypes.h"

class OpenSimplexNoise {
    friend class StaticConstructor;

   protected:
    // Contribution structs
    struct Contribution3 {
        public:
            Point d;
            Point sb;
            Contribution3 *Next;

            Contribution3(float multiplier, Point _sb) : sb(_sb), Next(nullptr) {
                d = wasm_f32x4_sub(
                    wasm_f32x4_mul(
                        sb,
                        wasm_f32x4_splat(-1.0f)
                    ),
                    wasm_f32x4_splat(multiplier * SQUISH_3D)
                );
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
                    current = new Contribution3(
                        baseSet[k],
                        wasm_f32x4_make(
                            baseSet[k + 1],
                            baseSet[k + 2],
                            baseSet[k + 3],
                            0
                        )
                    );

                    if (previous == nullptr) {
                        contributions3D[i / 9] = pContribution3(current);
                    } else {
                        previous->Next = current;
                    }
                    previous = current;
                }
                current->Next = new Contribution3(
                    p3D[i + 1],
                    wasm_f32x4_make(p3D[i + 2], p3D[i + 3], p3D[i + 4], 0)
                );
                current->Next->Next = new Contribution3(
                    p3D[i + 5],
                    wasm_f32x4_make( p3D[i + 6], p3D[i + 7], p3D[i + 8], 0)
                );
            }

            lookup3D.resize(2048);

            for (int i = 0; i < static_cast<int>(lookupPairs3D.size()); i += 2) {
                lookup3D[lookupPairs3D[i]] = contributions3D[lookupPairs3D[i + 1]].get();
            }
        }
    };
    static StaticConstructor staticConstructor;

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

    float Evaluate(Point p) {
        float pOut[4];
        wasm_v128_store(pOut, p);

        float stretchOffset = STRETCH_3D * (
            pOut[0] + pOut[1] + pOut[2]
        );

        Point s = wasm_f32x4_add(
            p,
            wasm_f32x4_splat(stretchOffset)
        );

        Point sb = __builtin_wasm_floor_f32x4(s);
///* /////////////////////////////////////////////
        float sOut[4];
        wasm_v128_store(sOut, s);

        int sOutDown[3] = {
            static_cast<int>(sOut[0]),
            static_cast<int>(sOut[1]),
            static_cast<int>(sOut[2])
        };

        Point sb2 = wasm_f32x4_make(
            sOut[0] < sOutDown[0] ? sOutDown[0] - 1 : sOutDown[0],
            sOut[1] < sOutDown[1] ? sOutDown[1] - 1 : sOutDown[1],
            sOut[2] < sOutDown[2] ? sOutDown[2] - 1 : sOutDown[2],
            0
        );

        if (wasm_f32x4_extract_lane(sb, 0) != wasm_f32x4_extract_lane(sb2, 0)) {
            exit(-1);
        }
////////////////////////////////////////////// */
        Point ins = wasm_f32x4_sub(s, sb);

        float insOut[4];
        wasm_v128_store(insOut, ins);

        float inSum = insOut[0] + insOut[1] + insOut[2];
        int hash = static_cast<int>(insOut[1] - insOut[2] + 1) |
                   static_cast<int>(insOut[0] - insOut[1] + 1) << 1 |
                   static_cast<int>(insOut[0] - insOut[2] + 1) << 2 |
                   static_cast<int>(inSum) << 3 |
                   static_cast<int>(inSum + insOut[2]) << 5 |
                   static_cast<int>(inSum + insOut[1]) << 7 |
                   static_cast<int>(inSum + insOut[0]) << 9;

        Contribution3 *c = lookup3D[hash];

        float sbOut[4];
        wasm_v128_store(sbOut, sb);
        float squishOffset = (sbOut[0] + sbOut[1] + sbOut[2]) * SQUISH_3D;
        Point d0 = wasm_f32x4_sub(
            p,
            wasm_f32x4_add(
                sb,
                wasm_f32x4_splat(squishOffset)
            )
        );

        float value = 0;
        while (c != nullptr) {
            Point d = wasm_f32x4_add(
                d0, c->d
            );
            float dOut[4];
            wasm_v128_store(dOut, d);

            Point dSquared = wasm_f32x4_mul(
                d0,
                d0
            );

            float dSquaredOut[4];
            wasm_v128_store(dSquaredOut, dSquared);
            float attn = 2 - dSquaredOut[0] - dSquaredOut[1] - dSquaredOut[2];
            if (attn > 0) {
                Point pa = wasm_f32x4_add(
                    sb,
                    c->sb
                );

                float paOut[4];
                wasm_v128_store(paOut, pa);
                int i = perm3D[(perm[(perm[static_cast<int>(paOut[0]) & 0xFF] + static_cast<int>(paOut[1])) & 0xFF] + static_cast<int>(paOut[2])) & 0xFF];
                float valuePart = gradients3D[i] * dOut[0] +
                                   gradients3D[i + 1] * dOut[1] +
                                   gradients3D[i + 2] * dOut[2];

                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c->Next;
        }

        return value * NORM_3D;
    }
};
