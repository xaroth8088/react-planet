import {useEffect, useRef, useState} from "react";
import {
    Color3,
    Color4,
    ComputeShader,
    Constants,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    RawTexture,
    Scene,
    StandardMaterial,
    StorageBuffer,
    UniformBuffer,
    Vector3,
    WebGPUEngine
} from "@babylonjs/core";
import PropTypes from "prop-types";
import {nearestPowerOfTwo, PERMUTATION_BUFFER_LENGTH} from '../utils/Math.js';
import {addNoiseSettingsToBuffer, addUniformsToBuffer, updateNoiseSettings} from '../utils/UniformBuffers.js';

const wgslcode = import.meta.glob('../wgsl/*.wgsl', {as: 'raw', eager: true});
const terrainShaderSource = Object.values(wgslcode).join('\n');

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
    const babylonData = useRef({
        engine: null,
        resize: null,
        uBuffer: null,
        terrainShader: null,
        width: 0,
        height: 0,
        surfaceNoiseBuffer: null,
        landNoiseBuffer: null,
        cloudNoiseBuffer: null
    });

    function updateUniforms() {
        if (!babylonData.current.uBuffer) {
            return;
        }

        babylonData.current.uBuffer.updateInt("textureWidth", babylonData.current.width);
        babylonData.current.uBuffer.updateInt("textureHeight", babylonData.current.height);
        babylonData.current.uBuffer.updateColor4("landColor1", Color3.FromHexString(landColor1), 1.0);
        babylonData.current.uBuffer.updateColor4("landColor2", Color3.FromHexString(landColor2), 1.0);
        babylonData.current.uBuffer.updateColor4("waterDeepColor", Color3.FromHexString(waterDeep), 1.0);
        babylonData.current.uBuffer.updateColor4("waterShallowColor", Color3.FromHexString(waterShallow), 1.0);
        babylonData.current.uBuffer.updateColor4("cloudColor", Color3.FromHexString(cloudColor), cloudOpacity);
        babylonData.current.uBuffer.updateFloat("waterLevel", waterLevel);
        babylonData.current.uBuffer.updateFloat("waterSpecular", waterSpecular);
        babylonData.current.uBuffer.updateFloat("waterFalloff", waterFalloff);
        babylonData.current.uBuffer.updateFloat("normalScale", normalScale);
        updateNoiseSettings(babylonData.current.uBuffer, babylonData.current.surfaceNoiseBuffer, "surfaceNoise", {
            seed: surfaceSeed,
            iScale: surfaceiScale,
            iOctaves: surfaceiOctaves,
            iFalloff: surfaceiFalloff,
            iIntensity: surfaceiIntensity,
            iRidginess: surfaceiRidginess,
            sScale: surfacesScale,
            sOctaves: surfacesOctaves,
            sFalloff: surfacesFalloff,
            sIntensity: surfacesIntensity
        });
        updateNoiseSettings(babylonData.current.uBuffer, babylonData.current.landNoiseBuffer, "landNoise", {
            seed: landSeed,
            iScale: landiScale,
            iOctaves: landiOctaves,
            iFalloff: landiFalloff,
            iIntensity: landiIntensity,
            iRidginess: landiRidginess,
            sScale: landsScale,
            sOctaves: landsOctaves,
            sFalloff: landsFalloff,
            sIntensity: landsIntensity
        });
        updateNoiseSettings(babylonData.current.uBuffer, babylonData.current.cloudNoiseBuffer, "cloudNoise", {
            seed: cloudSeed,
            iScale: cloudiScale,
            iOctaves: cloudiOctaves,
            iFalloff: cloudiFalloff,
            iIntensity: cloudiIntensity,
            iRidginess: cloudiRidginess,
            sScale: cloudsScale,
            sOctaves: cloudsOctaves,
            sFalloff: cloudsFalloff,
            sIntensity: cloudsIntensity
        });
        babylonData.current.uBuffer.update();
    }

    // set up basic engine and scene
    useEffect(
        () => {
            let isComponentMounted = true;

            async function initBabylon() {
                const {current: canvas} = reactCanvas;

                const engineOptions = {
                    adaptToDeviceRatio: true,
                    antialias: true,
                    audioEngine: false,
                    doNotHandleTouchAction: true
                };

                const engine = await new WebGPUEngine(canvas, engineOptions);
                if (!isComponentMounted) {
                    // The component may have been unmounted before getting here, so bail on further setup
                    await engine.initAsync();   // HACK - work around bug that prevents cleanly disposing before the engine is initialized and has run for a frame or so
                    setTimeout(() => engine.dispose(), 100);   // HACK - work around bug that prevents cleanly disposing before the engine is initialized and has run for a frame or so
                    return;
                }
                babylonData.current.engine = engine;
                await babylonData.current.engine.initAsync();

                if (!babylonData.current.engine.getCaps().supportComputeShaders) {
                    setError(true);
                    return;
                }

                const scene = new Scene(babylonData.current.engine, {});
                scene.clearColor = new Color4(0, 0, 0, 0);

                const camera = new FreeCamera("camera1", new Vector3(0, 0, -2.15), scene);
                camera.setTarget(Vector3.Zero());

                const light = new HemisphericLight("light", new Vector3(-8, 8, -2), scene);
                light.intensity = 0.7;

                const segments = 32;
                const planetMesh = MeshBuilder.CreateSphere("planet", {diameter: 1, segments}, scene);
                const cloudsMesh = MeshBuilder.CreateSphere("clouds", {diameter: 1.01, segments}, scene);

                babylonData.current.terrainShader = new ComputeShader(
                    "Terrain Shader",
                    babylonData.current.engine,
                    {
                        computeSource: terrainShaderSource
                    },
                    {
                        bindingsMapping:
                            {
                                "uniforms": {group: 0, binding: 0},
                                "diffuseTexture": {group: 1, binding: 0},
                                "normalTexture": {group: 1, binding: 1},
                                "specularTexture": {group: 1, binding: 2},
                                "cloudsTexture": {group: 1, binding: 3},
                                "surfaceNoisePermutations": {group: 2, binding: 0},
                                "landNoisePermutations": {group: 2, binding: 1},
                                "cloudNoisePermutations": {group: 2, binding: 2},
                            }
                    }
                );

                const textureResolution = nearestPowerOfTwo(resolution);    // Resolution must be bumped up to the nearest power of 2
                babylonData.current.width = textureResolution;
                babylonData.current.height = textureResolution / 2.0; // Textures must be 2:1 aspect ratio to wrap properly
                const diffuseTexture = RawTexture.CreateRGBAStorageTexture(
                    null,
                    babylonData.current.width,
                    babylonData.current.height,
                    scene,
                    false,
                    false
                );
                const normalTexture = RawTexture.CreateRGBAStorageTexture(
                    null,
                    babylonData.current.width,
                    babylonData.current.height,
                    scene,
                    false,
                    false
                );
                const specularTexture = RawTexture.CreateRGBAStorageTexture(
                    null,
                    babylonData.current.width,
                    babylonData.current.height,
                    scene,
                    false,
                    false
                );
                const cloudsTexture = RawTexture.CreateRGBAStorageTexture(
                    null,
                    babylonData.current.width,
                    babylonData.current.height,
                    scene,
                    false,
                    false
                );
                cloudsTexture.hasAlpha = true;

                babylonData.current.surfaceNoiseBuffer = new StorageBuffer(
                    babylonData.current.engine,
                    PERMUTATION_BUFFER_LENGTH * 4,
                    Constants.BUFFER_CREATIONFLAG_WRITE,
                    "surfaceNoiseBuffer"
                );
                babylonData.current.terrainShader.setStorageBuffer('surfaceNoisePermutations', babylonData.current.surfaceNoiseBuffer);
                babylonData.current.landNoiseBuffer = new StorageBuffer(
                    babylonData.current.engine,
                    PERMUTATION_BUFFER_LENGTH * 4,
                    Constants.BUFFER_CREATIONFLAG_WRITE,
                    "landNoiseBuffer"
                );
                babylonData.current.terrainShader.setStorageBuffer('landNoisePermutations', babylonData.current.landNoiseBuffer);
                babylonData.current.cloudNoiseBuffer = new StorageBuffer(
                    babylonData.current.engine,
                    PERMUTATION_BUFFER_LENGTH * 4,
                    Constants.BUFFER_CREATIONFLAG_WRITE,
                    "cloudNoiseBuffer"
                );
                babylonData.current.terrainShader.setStorageBuffer('cloudNoisePermutations', babylonData.current.cloudNoiseBuffer);

                babylonData.current.uBuffer = new UniformBuffer(babylonData.current.engine);
                // NOTE: Despite having a name param, uniforms must be added in the same order as they appear in the
                //       shader!  Updates can happen in an arbitrary order, however.
                addUniformsToBuffer(babylonData.current.uBuffer, [
                    ["textureWidth", 1],
                    ["textureHeight", 1],
                    ["landColor1", 4],
                    ["landColor2", 4],
                    ["waterDeepColor", 4],
                    ["waterShallowColor", 4],
                    ["cloudColor", 4],
                    ["waterLevel", 1],
                    ["waterSpecular", 1],
                    ["waterFalloff", 1],
                    ["normalScale", 1]
                ]);
                addNoiseSettingsToBuffer(babylonData.current.uBuffer, "surfaceNoise");
                addNoiseSettingsToBuffer(babylonData.current.uBuffer, "landNoise");
                addNoiseSettingsToBuffer(babylonData.current.uBuffer, "cloudNoise");

                updateUniforms();

                babylonData.current.terrainShader.setUniformBuffer("uniforms", babylonData.current.uBuffer);
                babylonData.current.terrainShader.setStorageTexture("diffuseTexture", diffuseTexture);
                babylonData.current.terrainShader.setStorageTexture("normalTexture", normalTexture);
                babylonData.current.terrainShader.setStorageTexture("specularTexture", specularTexture);
                babylonData.current.terrainShader.setStorageTexture("cloudsTexture", cloudsTexture);

                babylonData.current.terrainShader.dispatchWhenReady(babylonData.current.width, babylonData.current.height, 1);

                const planetMaterial = new StandardMaterial("Planet", scene);
                planetMaterial.diffuseTexture = diffuseTexture;
                planetMaterial.specularTexture = specularTexture;
                planetMaterial.bumpTexture = normalTexture;
                planetMesh.material = planetMaterial;

                const cloudsMaterial = new StandardMaterial("Clouds", scene);
                cloudsMaterial.diffuseTexture = cloudsTexture;
                cloudsMaterial.useAlphaFromDiffuseTexture = true;
                cloudsMesh.material = cloudsMaterial;

                babylonData.current.engine.runRenderLoop(() => {
                    planetMesh.rotation.y -= 0.0002;
                    cloudsMesh.rotation.y -= 0.0001;

                    scene.render();
                });

                const resize = () => {
                    babylonData.current.engine.resize();
                };

                if (window) {
                    window.addEventListener("resize", resize);
                }

                babylonData.current.resize = resize;
            }

            initBabylon();

            return () => {
                isComponentMounted = false;
                if (babylonData.current.engine) {
                    babylonData.current.engine.dispose();
                    babylonData.current.engine = null;
                }

                if (window) {
                    window.removeEventListener("resize", babylonData.current.resize);
                }
            };
        },
        [resolution]
    );

    useEffect(() => {
        // TODO: handle resolution changes
    }, [resolution]);

    // Effect for handling generation parameter changes
    useEffect(
        () => {
            updateUniforms();
            babylonData.current.terrainShader?.dispatch(babylonData.current.width, babylonData.current.height, 1);
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
