import { PerspectiveCamera, Scene, Object3D, Mesh, MeshPhongMaterial, DirectionalLight, WebGLRenderer, Texture, RepeatWrapping, Vector2, SphereGeometry } from 'three';

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

        this.planetMesh = new Mesh( new SphereGeometry(1, 32, 32), material );
        this.planet.add(this.planetMesh);

        this.cloudMesh = new Mesh(new SphereGeometry(1.01, 32, 32), material);
        this.planet.add(this.cloudMesh);

        const light = new DirectionalLight(0xffffff);
        light.position.set(1, 0, 1);
        this.scene.add(light);

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true
        });
    }

    setTexture(planetTexture) {
        this.diffuse = new Texture(planetTexture.diffuse.canvas);
        this.diffuse.wrapS = RepeatWrapping;
        this.normal = new Texture(planetTexture.normal.canvas);
        this.normal.wrapS = RepeatWrapping;
        this.specular = new Texture(planetTexture.specular.canvas);
        this.specular.wrapS = RepeatWrapping;
        let material = new MeshPhongMaterial({
            map: this.diffuse,
            normalMap: this.normal,
            specularMap: this.specular,
            normalScale: new Vector2(8, 8),
            specular: 0x777777,
            shininess: 16,
        });
        this.planetMesh.material = material;

        this.cloud = new Texture(planetTexture.cloud.canvas);
        this.cloud.wrapS = RepeatWrapping;
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
