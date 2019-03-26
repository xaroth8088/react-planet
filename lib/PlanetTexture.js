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

    surfaceHeight = (x, y, z) => this.params.surfaceNoise.sample(x / this.params.spin, y / this.params.spin, z);

    surfaceColor = (x, y, z) => {
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
    };

    update = () => {
        if (this.done) {
            return;
        }

        const {
            width, height, cloud, iterator, surfaceHeight, surfaceColor, diffuse, specular, normal, params
        } = this;

        const next = iterator.next();

        const { x, y } = next;
        const {
            waterLevel, waterFalloff, waterDeep, waterShallow, waterSpecular, cloudNoise, spin, cloudOpacity, cloudColor
        } = params;

        const p0 = sphereMap(x / (width - 1), y / (height - 1));
        const c0 = surfaceHeight(p0.x, p0.y, p0.z);
        const dr = 0.01;
        if (c0 > waterLevel) {
            const c = surfaceColor(p0.x, p0.y, p0.z);
            diffuse.setPixel(x, y, c.r, c.g, c.b, 1);
            specular.setPixel(x, y, 0, 0, 0, 1);
            const px = sphereMap((x + dr) / (width - 1), y / (height - 1));
            const py = sphereMap(x / (width - 1), (y + dr) / (height - 1));
            const cx = surfaceHeight(px.x, px.y, px.z);
            const cy = surfaceHeight(py.x, py.y, py.z);
            const n = new Vector3(
                dr / (width - 1),
                0,
                (cx - c0)
            );
            n.cross(
                new Vector3(
                    0,
                    dr / (height - 1),
                    (cy - c0)
                )
            );
            n.normalize();
            const rgb = normalRGBA(n.x, -n.y, n.z);
            normal.setPixel(x, y, rgb.r, rgb.g, rgb.b, 1);
        } else {
            const q1 = smootherstep((c0 / waterLevel) ** waterFalloff);
            const q0 = 1 - q1;
            const rgb = {
                r: waterDeep.r * q0 + waterShallow.r * q1,
                g: waterDeep.g * q0 + waterShallow.g * q1,
                b: waterDeep.b * q0 + waterShallow.b * q1
            };
            diffuse.setPixel(x, y, rgb.r, rgb.g, rgb.b, 1);
            specular.setPixel(
                x, y,
                waterSpecular,
                waterSpecular,
                waterSpecular,
                1
            );
            // rgb = normalRGBA(0, 0, 1);
            normal.setPixel(x, y, 0.5, 0.5, 1, 1);
        }
        const i = cloudNoise.sample(p0.x / spin, p0.y / spin, p0.z) * cloudOpacity;
        cloud.setPixel(
            x, y,
            cloudColor.r,
            cloudColor.g,
            cloudColor.b,
            i
        );

        this.done = next.done === 1;
    };

    releaseNoiseGenerators() {
        this.params.surfaceNoise = null;
        this.params.landNoise = null;
        this.params.cloudNoise = null;
    }
}
