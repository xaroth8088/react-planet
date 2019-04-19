import {
    DataTexture,
    DirectionalLight,
    LinearFilter,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    RepeatWrapping,
    RGBAFormat,
    Scene,
    SphereGeometry,
    UnsignedByteType,
    Vector2,
    WebGLRenderer
} from 'three';

export default class PlanetRenderer {
    constructor() {
        this.renderer = null;
        this.camera = null;
        this.scene = null;
        this.planet = null;
        this.planetMesh = null;
        this.cloudMesh = null;
        this.canvas = null;
        this.diffuse = null;
        this.specular = null;
        this.normal = null;
        this.cloud = null;

        this.canvas = document.createElement('canvas');

        this.camera = new PerspectiveCamera(61, 1, 0.1, 10);
        this.camera.position.set(0, 0, 2);
        this.scene = new Scene();
        this.planet = new Object3D();
        this.scene.add(this.planet);

        const material = new MeshPhongMaterial({
            color: 0xffffff
        });

        const segments = 24; // TODO: make this configurable via props

        this.planetMesh = new Mesh(new SphereGeometry(1, segments, segments), material);
        this.planet.add(this.planetMesh);

        this.cloudMesh = new Mesh(new SphereGeometry(1.01, segments, segments), material);
        this.planet.add(this.cloudMesh);

        const light = new DirectionalLight(0xffffff);
        light.position.set(1, 0, 1);
        this.scene.add(light);

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        }); // TODO: make some options here params
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setSize(width, height) {
        this.renderer.setSize(width, height);
    }

    init(
        width,
        height,
        diffusePixels,
        normalPixels,
        specularPixels,
        cloudPixels,
        normalScale
    ) {
        this.diffuse = new DataTexture(diffusePixels, width, height, RGBAFormat, UnsignedByteType);
        this.diffuse.wrapS = RepeatWrapping;
        this.diffuse.minFilter = LinearFilter;
        this.diffuse.maxFilter = LinearFilter;
        this.diffuse.needsUpdate = true;

        this.normal = new DataTexture(normalPixels, width, height, RGBAFormat, UnsignedByteType);
        this.normal.wrapS = RepeatWrapping;
        this.normal.needsUpdate = true;

        this.specular = new DataTexture(specularPixels, width, height, RGBAFormat, UnsignedByteType);
        this.specular.wrapS = RepeatWrapping;
        this.specular.needsUpdate = true;

        let material = new MeshPhongMaterial({
            map: this.diffuse,
            normalMap: this.normal,
            specularMap: this.specular,
            normalScale: new Vector2(normalScale, normalScale),
            specular: 0x777777,
            shininess: 16
        });
        this.planetMesh.material = material;

        this.cloud = new DataTexture(cloudPixels, width, height, RGBAFormat, UnsignedByteType);
        this.cloud.wrapS = RepeatWrapping;
        this.cloud.minFilter = LinearFilter;
        this.cloud.maxFilter = LinearFilter;

        this.cloud.needsUpdate = true;

        material = new MeshPhongMaterial({
            map: this.cloud,
            transparent: true,
            specular: 0x000000
        });
        this.cloudMesh.material = material;
    }
}
