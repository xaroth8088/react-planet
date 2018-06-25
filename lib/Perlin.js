import Alea from 'alea';
import ClassicalNoise from './ClassicalNoise';

export default class Perlin {
    constructor(seed) {
        const rand = {
            random: Alea(seed)
        };

        const noise = new ClassicalNoise(rand);
        this.noise = (x, y, z) => 0.5 * noise.noise(x, y, z) + 0.5;
    }
}
