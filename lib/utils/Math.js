import {createShuffle} from "fast-shuffle";
import memoize from "memoize";

export const PERMUTATION_BUFFER_LENGTH = 289;

function fls(mask) {
    /*
        https://github.com/udp/freebsd-libc/blob/master/string/fls.c
    */
    let bit;

    if (mask === 0) {
        return 0;
    }

    for (bit = 1; mask !== 1; bit++) {
        // eslint-disable-next-line no-bitwise, no-param-reassign
        mask >>= 1;
    }

    return (bit);
}

export function nearestPowerOfTwo(number) {
    return 2 ** fls(number - 1);
}

export const memoizedPermutationsFunction = memoize(generatePermutationsTable);

function generatePermutationsTable(seed) {
    // Create a permutation table for the noise generation
    // These need to be a randomized array of integers from 0 to 288 (inc.), duplicated (Isn't optimization fun?)
    const shuffler = createShuffle(seed);
    const permutations = shuffler(Array(PERMUTATION_BUFFER_LENGTH).fill(0).map(Number.call, Number));

    const retval = new Int32Array(PERMUTATION_BUFFER_LENGTH);
    retval.set([...permutations])
    return retval;
}
