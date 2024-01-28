import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    Color,
    LinearFilter,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    SphereGeometry,
    Vector2
} from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import StorageTexture from "three/addons/renderers/common/StorageTexture.js";
import {createShuffle} from 'fast-shuffle'
import {float, instanceIndex, textureStore, uint, vec2, vec3, vec4, wgslFn} from "three/nodes";
import mainWgsl from '../wgsl/main.wgsl?raw';

const wgslcode = import.meta.glob('../wgsl/includes/*.wgsl', {as: 'raw', eager: true});

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

function nearestPowerOfTwo(number) {
    return 2 ** fls(number - 1);
}

function generatePermutationsTable(seed) {
    // Create a permutation table for the noise generation
    // These need to be a randomized array of integers from 0 to 288 (inc.), duplicated (Isn't optimization fun?)
    const shuffler = createShuffle(seed);
    const permutations = shuffler(Array(289).fill(0).map(Number.call, Number));

    // TODO: maybe the %289's in the shader aren't as bad as passing the params list in twice...
    return [...permutations, ...permutations];
}

const Planet = (props) => {
    const {
        resolution,

        surfaceSeed,
        surfaceiScale,
        surfaceiOctaves,
        surfaceiFalloff,
        surfaceiIntensity,
        surfaceiRidginess,
        surfacesScale,
        surfacesOctaves,
        surfacesFalloff,
        surfacesIntensity,

        landSeed,
        landColor1,
        landColor2,
        landiScale,
        landiOctaves,
        landiFalloff,
        landiIntensity,
        landiRidginess,
        landsScale,
        landsOctaves,
        landsFalloff,
        landsIntensity,

        waterDeep,
        waterShallow,
        waterLevel,
        waterSpecular,
        waterFalloff,

        cloudSeed,
        cloudColor,
        cloudOpacity,
        cloudiScale,
        cloudiOctaves,
        cloudiFalloff,
        cloudiIntensity,
        cloudiRidginess,
        cloudsScale,
        cloudsOctaves,
        cloudsFalloff,
        cloudsIntensity,
        normalScale,
        animate
    } = props;

    const mountRef = useRef(null);
    const threeInstance = useRef({
        renderer: null,
        scene: null,
        camera: null,
        animate: true,
        planetMesh: null,
        cloudsMesh: null
    });

    useEffect(() => {
        if (WebGPU.isAvailable() === false) {
            mountRef.current.replaceChildren(WebGPU.getErrorMessage());
            return;
        }

        threeInstance.current.animate = true;

        threeInstance.current.scene = new Scene();
        const containerWidth = mountRef.current.clientWidth;
        const containerHeight = mountRef.current.clientHeight;

        // Camera setup
        threeInstance.current.camera = new PerspectiveCamera(61, 1, 0.1, 10);
        threeInstance.current.camera.position.set(0, 0, 2);
        threeInstance.current.camera.lookAt(threeInstance.current.scene.position);

        // Renderer setup
        threeInstance.current.renderer = new WebGPURenderer({alpha: true, antialias: true});
        threeInstance.current.renderer.setClearColor(0, 0.0);
        threeInstance.current.renderer.setSize(containerWidth, containerHeight);
        threeInstance.current.renderer.setPixelRatio(window.devicePixelRatio);

        // Textures setup
        const textureResolution = nearestPowerOfTwo(resolution);    // Resolution must be bumped up to the nearest power of 2
        const width = textureResolution;
        const height = textureResolution / 2.0; // Textures must be 2:1 aspect ratio to wrap properly

        const diffuseTexture = new StorageTexture(width, height);
        diffuseTexture.wrapS = RepeatWrapping;
        diffuseTexture.minFilter = LinearFilter;
        diffuseTexture.maxFilter = LinearFilter;

        const normalTexture = new StorageTexture(width, height);
        normalTexture.wrapS = RepeatWrapping;

        const specularTexture = new StorageTexture(width, height);
        specularTexture.wrapS = RepeatWrapping;

        const cloudTexture = new StorageTexture(width, height);
        cloudTexture.wrapS = RepeatWrapping;
        cloudTexture.minFilter = LinearFilter;
        cloudTexture.maxFilter = LinearFilter;

        // Generate textures
        const landColor1RGB = new Color(landColor1);
        const landColor2RGB = new Color(landColor2);
        const waterDeepColorRGB = new Color(waterDeep);
        const waterShallowColorRGB = new Color(waterShallow);
        const cloudColorRGB = new Color(cloudColor);

        const computeWGSL = wgslFn(
            [mainWgsl, ...Object.values(wgslcode)].join('\n')
        );
        const computeWGSLCall = computeWGSL({
            index: instanceIndex,
            diffuseTexture: textureStore(diffuseTexture),
            normalTexture: textureStore(normalTexture),
            specularTexture: textureStore(specularTexture),
            cloudTexture: textureStore(cloudTexture),
            textureSize: vec2(width, height),
            landColor1: vec3(landColor1RGB.r, landColor1RGB.g, landColor1RGB.b),
            landColor2: vec3(landColor2RGB.r, landColor2RGB.g, landColor2RGB.b),
            waterDeepColor: vec3(waterDeepColorRGB.r, waterDeepColorRGB.g, waterDeepColorRGB.b),
            waterShallowColor: vec3(waterShallowColorRGB.r, waterShallowColorRGB.g, waterShallowColorRGB.b),
            cloudColor: vec4(cloudColorRGB.r, cloudColorRGB.g, cloudColorRGB.b, cloudOpacity),
            waterLevel: float(waterLevel),
            waterSpecular: float(waterSpecular),
            waterFalloff: float(waterFalloff),
//            surfaceNoise_perm: generatePermutationsTable(surfaceSeed),
            surfaceNoise_iScale: float(surfaceiScale),
            surfaceNoise_iOctaves: uint(surfaceiOctaves),
            surfaceNoise_iFalloff: float(surfaceiFalloff),
            surfaceNoise_iIntensity: float(surfaceiIntensity),
            surfaceNoise_iRidginess: float(surfaceiRidginess),
            surfaceNoise_sScale: float(surfacesScale),
            surfaceNoise_sOctaves: uint(surfacesOctaves),
            surfaceNoise_sFalloff: float(surfacesFalloff),
            surfaceNoise_sIntensity: float(surfacesIntensity),
//            landNoise_perm: generatePermutationsTable(landSeed),
            landNoise_iScale: float(landiScale),
            landNoise_iOctaves: uint(landiOctaves),
            landNoise_iFalloff: float(landiFalloff),
            landNoise_iIntensity: float(landiIntensity),
            landNoise_iRidginess: float(landiRidginess),
            landNoise_sScale: float(landsScale),
            landNoise_sOctaves: uint(landsOctaves),
            landNoise_sFalloff: float(landsFalloff),
            landNoise_sIntensity: float(landsIntensity),
//            cloudNoise_perm: generatePermutationsTable(cloudSeed),
            cloudNoise_iScale: float(cloudiScale),
            cloudNoise_iOctaves: uint(cloudiOctaves),
            cloudNoise_iFalloff: float(cloudiFalloff),
            cloudNoise_iIntensity: float(cloudiIntensity),
            cloudNoise_iRidginess: float(cloudiRidginess),
            cloudNoise_sScale: float(cloudsScale),
            cloudNoise_sOctaves: uint(cloudsOctaves),
            cloudNoise_sFalloff: float(cloudsFalloff),
            cloudNoise_sIntensity: float(cloudsIntensity),
        });
        const computeNode = computeWGSLCall.compute(width * height);

        // Materials setup
        const planetMaterial = new MeshPhongMaterial({
            map: diffuseTexture,
            normalMap: normalTexture,
            specularMap: specularTexture,
            normalScale: new Vector2(normalScale, normalScale),
            specular: 0x777777,
            shininess: 16
        });

        const cloudsMaterial = new MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            specular: 0x000000
        });

        // Meshes setup
        const segments = 24;
        threeInstance.current.planetMesh = new Mesh(
            new SphereGeometry(1, segments, segments),
            planetMaterial
        );
        threeInstance.current.scene.add(threeInstance.current.planetMesh);
        threeInstance.current.cloudsMesh = new Mesh(
            new SphereGeometry(1.01, segments, segments),
            cloudsMaterial
        );
        threeInstance.current.scene.add(threeInstance.current.cloudsMesh);

        // TODO: Lighting setup
        //       This code seems to cause three.js to crash.  No doubt the way lighting works has changed,
        //       and - honestly - we probably need to change the way the textures are generated to match the "new"
        //       way that three.js is doing lighting/rendering.
        // const light = new DirectionalLight(0xffffff);
        // light.position.set(1, 0, 1);
        // threeInstance.current.scene.add(light);

        // Run the compute shader
        threeInstance.current.renderer.compute(computeNode);

        // Kick off the rendering/animation loop
        threeInstance.current.animate = true;
        const animateLoop = () => {
            if (!threeInstance.current.animate) return;
            requestAnimationFrame(animateLoop);

            // Update logic
            if (animate) {
                threeInstance.current.cloudsMesh.rotation.y += 0.0002;
                threeInstance.current.planetMesh.rotation.y += 0.0001;
            }

            threeInstance.current.renderer.render(threeInstance.current.scene, threeInstance.current.camera);
        };
        animateLoop();

        mountRef.current.replaceChildren(threeInstance.current.renderer.domElement);

        // Cleanup
        return () => {
            threeInstance.current.animate = false;
            mountRef.current?.removeChild(threeInstance.current.renderer.domElement);
            diffuseTexture.dispose();
            normalTexture.dispose();
            specularTexture.dispose();
            cloudTexture.dispose();
            planetMaterial.dispose();
            cloudsMaterial.dispose();
            threeInstance.current?.planetMesh.geometry.dispose();
            threeInstance.current?.cloudsMesh.geometry.dispose();
            computeNode.dispose();
        };
    }, []);

    // Effect for handling props changes
    useEffect(
        () => {
            if (!threeInstance.current) {
                return;
            }

            updateThreeInstance(
                resolution,
                surfaceSeed,
                surfaceiScale,
                surfaceiOctaves,
                surfaceiFalloff,
                surfaceiIntensity,
                surfaceiRidginess,
                surfacesScale,
                surfacesOctaves,
                surfacesFalloff,
                surfacesIntensity,

                landSeed,
                landColor1,
                landColor2,
                landiScale,
                landiOctaves,
                landiFalloff,
                landiIntensity,
                landiRidginess,
                landsScale,
                landsOctaves,
                landsFalloff,
                landsIntensity,

                waterDeep,
                waterShallow,
                waterLevel,
                waterSpecular,
                waterFalloff,

                cloudSeed,
                cloudColor,
                cloudOpacity,
                cloudiScale,
                cloudiOctaves,
                cloudiFalloff,
                cloudiIntensity,
                cloudiRidginess,
                cloudsScale,
                cloudsOctaves,
                cloudsFalloff,
                cloudsIntensity,
                normalScale,
                animate
            );
        },
        [
            resolution,
            surfaceSeed,
            surfaceiScale,
            surfaceiOctaves,
            surfaceiFalloff,
            surfaceiIntensity,
            surfaceiRidginess,
            surfacesScale,
            surfacesOctaves,
            surfacesFalloff,
            surfacesIntensity,

            landSeed,
            landColor1,
            landColor2,
            landiScale,
            landiOctaves,
            landiFalloff,
            landiIntensity,
            landiRidginess,
            landsScale,
            landsOctaves,
            landsFalloff,
            landsIntensity,

            waterDeep,
            waterShallow,
            waterLevel,
            waterSpecular,
            waterFalloff,

            cloudSeed,
            cloudColor,
            cloudOpacity,
            cloudiScale,
            cloudiOctaves,
            cloudiFalloff,
            cloudiIntensity,
            cloudiRidginess,
            cloudsScale,
            cloudsOctaves,
            cloudsFalloff,
            cloudsIntensity,
            normalScale,
            animate
        ]
    ); // Depend on props that should trigger updates

    const updateThreeInstance = (
        resolution,
        surfaceSeed,
        surfaceiScale,
        surfaceiOctaves,
        surfaceiFalloff,
        surfaceiIntensity,
        surfaceiRidginess,
        surfacesScale,
        surfacesOctaves,
        surfacesFalloff,
        surfacesIntensity,
        landSeed,
        landColor1,
        landColor2,
        landiScale,
        landiOctaves,
        landiFalloff,
        landiIntensity,
        landiRidginess,
        landsScale,
        landsOctaves,
        landsFalloff,
        landsIntensity,
        waterDeep,
        waterShallow,
        waterLevel,
        waterSpecular,
        waterFalloff,
        cloudSeed,
        cloudColor,
        cloudOpacity,
        cloudiScale,
        cloudiOctaves,
        cloudiFalloff,
        cloudiIntensity,
        cloudiRidginess,
        cloudsScale,
        cloudsOctaves,
        cloudsFalloff,
        cloudsIntensity,
        normalScale,
        animate
    ) => {
        // Logic to interact with Three.js based on prop changes
        // For example, updating objects, changing materials, etc.
    };

    // Any props that the library doesn't care about should be passed on to the containing div
    const divProps = {};
    Object.keys(props).forEach(
        (key) => {
            if (!(key in Planet.propTypes)) {
                divProps[key] = props[key];
            }
        }
    );

    return <div ref={mountRef} {...divProps} />;
};

Planet.defaultProps = {
    normalScale: 0.05,
    animate: true
};


Planet.propTypes = {
    resolution: PropTypes.number,

    surfaceSeed: PropTypes.number,
    surfaceiScale: PropTypes.number,
    surfaceiOctaves: PropTypes.number,
    surfaceiFalloff: PropTypes.number,
    surfaceiIntensity: PropTypes.number,
    surfaceiRidginess: PropTypes.number,
    surfacesScale: PropTypes.number,
    surfacesOctaves: PropTypes.number,
    surfacesFalloff: PropTypes.number,
    surfacesIntensity: PropTypes.number,

    landSeed: PropTypes.number,
    landColor1: PropTypes.string,
    landColor2: PropTypes.string,
    landiScale: PropTypes.number,
    landiOctaves: PropTypes.number,
    landiFalloff: PropTypes.number,
    landiIntensity: PropTypes.number,
    landiRidginess: PropTypes.number,
    landsScale: PropTypes.number,
    landsOctaves: PropTypes.number,
    landsFalloff: PropTypes.number,
    landsIntensity: PropTypes.number,

    waterDeep: PropTypes.string,
    waterShallow: PropTypes.string,
    waterLevel: PropTypes.number,
    waterSpecular: PropTypes.number,
    waterFalloff: PropTypes.number,

    cloudSeed: PropTypes.number,
    cloudColor: PropTypes.string,
    cloudOpacity: PropTypes.number,
    cloudiScale: PropTypes.number,
    cloudiOctaves: PropTypes.number,
    cloudiFalloff: PropTypes.number,
    cloudiIntensity: PropTypes.number,
    cloudiRidginess: PropTypes.number,
    cloudsScale: PropTypes.number,
    cloudsOctaves: PropTypes.number,
    cloudsFalloff: PropTypes.number,
    cloudsIntensity: PropTypes.number,
    normalScale: PropTypes.number,
    animate: PropTypes.bool
}

export default Planet;

