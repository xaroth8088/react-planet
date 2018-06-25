import { Vector3 } from 'three';
import PixelSurface from './PixelSurface';
import { normalRGBA, smootherstep, sphereMap } from './Util';
import XYIterator from './XYIterator';

export default class PlanetTexture {
    constructor(params) {
        this.params = params;
        this.width = params.width;
        this.height = params.width / 2;
        this.iterator = new XYIterator(this.width, this.height);
        this.diffuse = new PixelSurface(this.width, this.height);
        this.normal = new PixelSurface(this.width, this.height);
        this.specular = new PixelSurface(this.width, this.height);
        this.cloud = new PixelSurface(this.width, this.height);
        this.done = false;
    }

    surfaceHeight(x, y, z) {
        return this.params.surfaceNoise.sample(x / this.params.spin, y / this.params.spin, z);
    }

    surfaceColor(x, y, z) {
        const c = this.params.landNoise.sample(
            x / this.params.spin,
            y / this.params.spin,
            z
        );
        const q0 = c;
        const q1 = 1 - c;
        const r = this.params.landColor1.r * q0 + this.params.landColor2.r * q1;
        const g = this.params.landColor1.g * q0 + this.params.landColor2.g * q1;
        const b = this.params.landColor1.b * q0 + this.params.landColor2.b * q1;
        return {
            r,
            g,
            b
        };
    }

    update() {
        if (this.done) {
            return;
        }
        const next = this.iterator.next();
        const p0 = sphereMap(next.x / (this.width - 1), next.y / (this.height - 1));
        const c0 = this.surfaceHeight(p0.x, p0.y, p0.z);
        const dr = 0.01;
        if (c0 > this.params.waterLevel) {
            const c = this.surfaceColor(p0.x, p0.y, p0.z);
            this.diffuse.setPixel(next.x, next.y, c.r, c.g, c.b, 1);
            this.specular.setPixel(next.x, next.y, 0, 0, 0, 1);
            const px = sphereMap((next.x + dr) / (this.width - 1), next.y / (this.height - 1));
            const py = sphereMap(next.x / (this.width - 1), (next.y + dr) / (this.height - 1));
            const cx = this.surfaceHeight(px.x, px.y, px.z);
            const cy = this.surfaceHeight(py.x, py.y, py.z);
            const n = new Vector3(
                dr / (this.width - 1),
                0,
                (cx - c0)
            );
            n.cross(
                new Vector3(
                    0,
                    dr / (this.height - 1),
                    (cy - c0)
                )
            );
            n.normalize();
            const rgb = normalRGBA(n.x, -n.y, n.z);
            this.normal.setPixel(next.x, next.y, rgb.r, rgb.g, rgb.b, 1);
        } else {
            const q1 = smootherstep((c0 / this.params.waterLevel) ** this.params.waterFalloff);
            const q0 = 1 - q1;
            let rgb = {
                r: this.params.waterDeep.r * q0 + this.params.waterShallow.r * q1,
                g: this.params.waterDeep.g * q0 + this.params.waterShallow.g * q1,
                b: this.params.waterDeep.b * q0 + this.params.waterShallow.b * q1
            };
            this.diffuse.setPixel(next.x, next.y, rgb.r, rgb.g, rgb.b, 1);
            this.specular.setPixel(
                next.x, next.y,
                this.params.waterSpecular,
                this.params.waterSpecular,
                this.params.waterSpecular,
                1
            );
            rgb = normalRGBA(0, 0, 1);
            this.normal.setPixel(next.x, next.y, rgb.r, rgb.g, rgb.b, 1);
        }
        const i = this.params.cloudNoise.sample(p0.x / this.params.spin, p0.y / this.params.spin, p0.z) * this.params.cloudOpacity;
        this.cloud.setPixel(
            next.x, next.y,
            this.params.cloudColor.r,
            this.params.cloudColor.g,
            this.params.cloudColor.b,
            i
        );
        this.done = next.done === 1;
    }
}
