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

    setTexture(planetTexture) {
        this.diffuse = new DataTexture(planetTexture.diffuse.pixels, planetTexture.diffuse.width, planetTexture.diffuse.height, RGBAFormat, UnsignedByteType);
        this.diffuse.wrapS = RepeatWrapping;
        this.normal = new DataTexture(planetTexture.normal.pixels, planetTexture.normal.width, planetTexture.normal.height, RGBAFormat, UnsignedByteType);
        this.normal.wrapS = RepeatWrapping;
        this.specular = new DataTexture(planetTexture.specular.pixels, planetTexture.specular.width, planetTexture.specular.height, RGBAFormat, UnsignedByteType);
        this.specular.wrapS = RepeatWrapping;
        let material = new MeshPhongMaterial({
            map: this.diffuse,
            normalMap: this.normal,
            specularMap: this.specular,
            normalScale: new Vector2(8, 8),
            specular: 0x777777,
            shininess: 16
        });
        this.planetMesh.material = material;

        this.cloud = new DataTexture(planetTexture.cloud.pixels, planetTexture.cloud.width, planetTexture.cloud.height, RGBAFormat, UnsignedByteType);
        this.cloud.wrapS = RepeatWrapping;
        this.cloud.minFilter = LinearFilter;
        material = new MeshPhongMaterial({
            map: this.cloud,
            transparent: true,
            specular: 0x000000
        });
        this.cloudMesh.material = material;
    }

    updateTexture() {
        this.diffuse.needsUpdate = true;
        this.normal.needsUpdate = true;
        this.specular.needsUpdate = true;
        this.cloud.needsUpdate = true;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setSize(width, height) {
        this.renderer.setSize(width, height);
    }

    setNormalScale(s) {
        this.planetMesh.material.normalScale = new Vector2(s, s);
    }
}
