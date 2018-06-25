import THREE from 'three';

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

        this.camera = new THREE.PerspectiveCamera(61, 1, 0.1, 10);
        this.camera.position.set(0, 0, 2);
        this.scene = new THREE.Scene();
        this.planet = new THREE.Object3D();
        this.scene.add(this.planet);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });

        // TODO: The detail level "5" for the spheres makes for a very slow startup time.  See if this can be lowered, or - better yet - made configurable without breaking rendering.
        this.planetMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 5), material);
        this.planet.add(this.planetMesh);

        this.cloudMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.001, 5), material);
        this.planet.add(this.cloudMesh);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 0, 1);
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true
        });
    }

    setTexture(planetTexture) {
        this.diffuse = new THREE.Texture(planetTexture.diffuse.canvas);
        this.diffuse.wrapS = THREE.RepeatWrapping;
        this.normal = new THREE.Texture(planetTexture.normal.canvas);
        this.normal.wrapS = THREE.RepeatWrapping;
        this.specular = new THREE.Texture(planetTexture.specular.canvas);
        this.specular.wrapS = THREE.RepeatWrapping;
        let material = new THREE.MeshPhongMaterial({
            map: this.diffuse,
            normalMap: this.normal,
            specularMap: this.specular,
            normalScale: new THREE.Vector2(8, 8),
            specular: 0x777777,
            shininess: 16,
            metal: false
        });
        this.planetMesh.material = material;

        this.cloud = new THREE.Texture(planetTexture.cloud.canvas);
        this.cloud.wrapS = THREE.RepeatWrapping;
        material = new THREE.MeshPhongMaterial({
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
        this.planetMesh.material.normalScale = new THREE.Vector2(s, s);
    }
}
