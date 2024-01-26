import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types'
import {Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer} from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

// const wgslcode = import.meta.glob('../wgsl/*.wgsl', { as: 'raw', eager: true });

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


const Planet = (
    {
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
    }
) => {
    const mountRef = useRef(null);
    const threeInstance = useRef({renderer: null, scene: null, camera: null, animate: true, sphere: null});

    useEffect(() => {
        if (WebGPU.isAvailable() === false) {
            mountRef.current.replaceChildren(WebGPU.getErrorMessage());
            return;
        }

        threeInstance.current.animate = true;

        threeInstance.current.scene = new Scene();
        const WIDTH = mountRef.current.clientWidth;
        const HEIGHT = mountRef.current.clientHeight;
        console.log(`${WIDTH} x ${HEIGHT}`);

        threeInstance.current.camera = new PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
        threeInstance.current.camera.position.set(0, 3.5, 5);
        threeInstance.current.camera.lookAt(threeInstance.current.scene.position);

        threeInstance.current.renderer = new WebGPURenderer({ alpha: true, antialias: true });
        threeInstance.current.renderer.setClearColor( 0, 0.0 );
        threeInstance.current.renderer.setSize(WIDTH, HEIGHT);
        threeInstance.current.renderer.setPixelRatio(window.devicePixelRatio);

        const segments = 24;
        threeInstance.current.sphere = new Mesh(new SphereGeometry(1, segments, segments), new MeshNormalMaterial());
        threeInstance.current.scene.add(threeInstance.current.sphere);

        threeInstance.current.animate = true;
        const animateLoop = () => {
            if (!threeInstance.current.animate) return;
            requestAnimationFrame(animateLoop);
            console.log('frame');

            // Update logic
            threeInstance.current.sphere.rotation.x += 0.01;
            // ...

            threeInstance.current.renderer.render(threeInstance.current.scene, threeInstance.current.camera);
        };
        animateLoop();

        mountRef.current.appendChild(threeInstance.current.renderer.domElement);

        // Cleanup
        return () => {
            console.log('cleanup!');
            threeInstance.current.animate = false;
            mountRef.current?.removeChild(threeInstance.current.renderer.domElement);
            // Additional cleanup
        };

    }, []);

    // Initialize Three.js only once
    // useEffect(() => {
    //     threeInstance.current.animate = true;
    //     if (WebGPU.isAvailable() === false) {
    //
    //         document.body.appendChild(WebGPU.getErrorMessage());
    //         threeInstance.current.renderer.domElement.appendChild(WebGPU.getErrorMessage());
    //
    //         throw new Error('No WebGPU support');
    //     }
    //
    //     threeInstance.current.scene = new THREE.Scene();
    //     threeInstance.current.camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    //
    //     // Create the textures
    //     const textureResolution = nearestPowerOfTwo(resolution);    // Resolution must be bumped up to the nearest power of 2
    //
    //     // Textures must be 2:1 aspect ratio to wrap properly
    //     const width = textureResolution;
    //     const height = textureResolution / 2.0;
    //
    //     const diffuseTexture = new StorageTexture(width, height);
    //     const normalTexture = new StorageTexture(width, height);
    //     const specularTexture = new StorageTexture(width, height);
    //     const cloudTexture = new StorageTexture(width, height);
    //
    //     // Create the compute shader
    //     // const computeWGSL = wgslFn(Object.values(wgslcode).join(''));
    //     // const computeNode = computeWGSLCall.compute( width * height );
    //     const computeWGSL = wgslFn(simpleWGSL);
    //     const computeWGSLCall = computeWGSL( {
    //         index: instanceIndex,
    //         width: uint(width),
    //         diffuseTexture: textureStore( diffuseTexture ),
    //     });
    //     const computeNode = computeWGSLCall.compute( width * height );
    //
    //     // Create the materials
    //     const planetMaterial = new MeshPhongMaterial({
    //         map: diffuseTexture,
    //         normalMap: normalTexture,
    //         specularMap: specularTexture,
    //         normalScale: new Vector2(normalScale, normalScale),
    //         specular: 0x777777,
    //         shininess: 16
    //     });
    //
    //     const cloudsMaterial = new MeshPhongMaterial({
    //         map: cloudTexture,
    //         transparent: true,
    //         specular: 0x000000
    //     });
    //
    //     // Add the meshes
    //     const segments = 24;    // TODO: make this a prop
    //
    //     const planetMesh = new Mesh(new SphereGeometry(1, segments, segments), planetMaterial);
    //     threeInstance.current.scene.add(planetMesh);
    //
    //     const cloudMesh = new Mesh(new SphereGeometry(1.01, segments, segments), cloudsMaterial);
    //     threeInstance.current.scene.add(cloudMesh);
    //
    //     threeInstance.current.renderer = new WebGPURenderer({antialias: true});
    //     threeInstance.current.renderer.setPixelRatio(window.devicePixelRatio);
    //     threeInstance.current.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    //     mountRef.current.appendChild(threeInstance.current.renderer.domElement);
    //
    //     // Run the compute shader
    //     threeInstance.current.renderer.compute(computeNode);
    //     console.log('Initialized!');
    //
    //     // Animation loop
    //     const animateLoop = () => {
    //         if (!threeInstance.current.animate) return;
    //         requestAnimationFrame(animateLoop);
    //
    //         // Update logic
    //         // ...
    //
    //         threeInstance.current.renderer.render(threeInstance.current.scene, threeInstance.current.camera);
    //     };
    //     animateLoop();
    //
    //     // Cleanup
    //     return () => {
    //         console.log('cleanup!');
    //         threeInstance.current.animate = false;
    //         mountRef.current.removeChild(threeInstance.current.renderer.domElement);
    //         // Additional cleanup
    //     };
    // }, []);

    // Effect for handling props changes
    useEffect(() => {
        if (threeInstance.current) {
            // Function to interact with the Three.js instance
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
        }
    }, [
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
    ]); // Depend on props that should trigger updates

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

    return <div ref={mountRef} style={{border: '5px solid #f0f', width: '50%', height: '100%'}}/>;
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

