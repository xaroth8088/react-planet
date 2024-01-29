import {useEffect, useRef, useState} from "react";
import {
    Color3,
    Color4,
    ComputeShader,
    FreeCamera,
    HemisphericLight,
    MeshBuilder, RawTexture,
    Scene, StandardMaterial, UniformBuffer,
    Vector3,
    WebGPUEngine
} from "@babylonjs/core";
import PropTypes from "prop-types";

const clearTextureComputeShader = `
    @group(0) @binding(0) var tbuf : texture_storage_2d<rgba8unorm,write>;

    struct Params {
        color : vec4<f32>
    };
    @group(0) @binding(1) var<uniform> params : Params;

    @compute @workgroup_size(1, 1, 1)

    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        textureStore(tbuf, vec2<i32>(global_id.xy), params.color);
    }
`;


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
        animate,
        ...rest
    }
) => {
    const [showError, setError] = useState(false);
    const reactCanvas = useRef(null);

    // set up basic engine and scene
    useEffect(
        () => {
            let engine, resize;

            async function initBabylon() {
                const {current: canvas} = reactCanvas;

                if (!canvas) return;
                console.log(canvas);

                // const engineOptions = {
                //     adaptToDeviceRatio: true,
                //     antialias: true,
                //     audioEngine: false,
                //     doNotHandleTouchAction: true
                // };
                const engineOptions = {};
                const sceneOptions = {};

                engine = await new WebGPUEngine(canvas, engineOptions);
                await engine.initAsync();
                const scene = new Scene(engine, sceneOptions);
                scene.clearColor = new Color4(0, 0, 0, 0);

                const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
                camera.setTarget(Vector3.Zero());

                const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
                light.intensity = 0.7;

                // Our built-in 'sphere' shape.
                const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
                sphere.position.y = 1;  // Move the sphere upward 1/2 its height

                if (!engine.getCaps().supportComputeShaders) {
                    setError(true);
                    return;
                }

                const cs2 = new ComputeShader("myCompute2", engine, {computeSource: clearTextureComputeShader}, {
                    bindingsMapping:
                        {
                            "tbuf": {group: 0, binding: 0},
                            "params": {group: 0, binding: 1}
                        }
                });

                const dest2 = RawTexture.CreateRGBAStorageTexture(null, 512, 512, scene, false, false);

                const uBuffer = new UniformBuffer(engine);

                uBuffer.updateColor4("color", new Color3(1, 0.6, 0.8), 1);
                uBuffer.update();

                cs2.setStorageTexture("tbuf", dest2);
                cs2.setUniformBuffer("params", uBuffer);

                cs2.dispatchWhenReady(dest2.getSize().width, dest2.getSize().height, 1);

                const mat2 = new StandardMaterial("mat2", scene);
                mat2.diffuseTexture = dest2;

                sphere.material = mat2;

                engine.runRenderLoop(() => {
                    scene.render();
                });

                resize = () => {
                    engine.resize();
                };

                if (window) {
                    window.addEventListener("resize", resize);
                }
            }

            initBabylon();

            return () => {
                if (engine) {
                    engine.dispose();
                }

                if (window) {
                    window.removeEventListener("resize", resize);
                }
            };
        },
        [resolution]
    );

    // Effect for handling generation parameter changes
    useEffect(
        () => {
            updateParams(
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
    );

    const updateParams = (
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
        normalScale
    ) => {
        // Logic to interact with Three.js based on prop changes
        // For example, updating objects, changing materials, etc.
        console.log('prop updated!');
    };

    if (showError) {
        return (
            <div {...rest}>
                WebGPU is not supported
            </div>
        );
    }

    return <canvas ref={reactCanvas} {...rest} />;
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
