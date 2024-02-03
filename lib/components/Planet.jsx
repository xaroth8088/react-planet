import {useEffect, useRef, useState} from "react";
import {
    Color3,
    Color4,
    ComputeShader,
    DirectionalLight,
    FreeCamera,
    MeshBuilder,
    RawTexture,
    Scene,
    StandardMaterial,
    UniformBuffer,
    Vector3,
    WebGPUEngine
} from "@babylonjs/core";
import PropTypes from "prop-types";
import {nearestPowerOfTwo} from '../utils/Math.js';
import {addNoiseSettingsToBuffer, addUniformsToBuffer, updateNoiseSettings} from '../utils/UniformBuffers.js';
import {WGSLBuilder} from "../utils/WGSLBuilder.js";
//import { Inspector } from '@babylonjs/inspector';

const NOISE_TYPES = {
    LAND_NOISE: 0,
    CLOUD_NOISE: 1
};

const textureGeneratorShaderSource = WGSLBuilder([
    'TextureGenerator/textureGenerator.wgsl',
    'utils/constants.wgsl',
    'utils/maths.wgsl',
    'utils/noise_wrapper.wgsl',
    'utils/iq_noise.wgsl'
]);

const normalsGeneratorSource = WGSLBuilder([
    'NormalsGenerator/normalsGenerator.wgsl'
]);

function createTextures(width, height, scene) {
    const diffuseTexture = RawTexture.CreateRGBAStorageTexture(
        null,
        width,
        height,
        scene,
        false,
        false
    );
    diffuseTexture.name = "diffuse";
    diffuseTexture.hasAlpha = false;
    const specularTexture = RawTexture.CreateRGBAStorageTexture(
        null,
        width,
        height,
        scene,
        false,
        false
    );
    specularTexture.name = "specular";
    const cloudsTexture = RawTexture.CreateRGBAStorageTexture(
        null,
        width,
        height,
        scene,
        false,
        false
    );
    cloudsTexture.name = "clouds";
    cloudsTexture.hasAlpha = true;
    const normalsTexture = RawTexture.CreateRGBAStorageTexture(
        null,
        width,
        height,
        scene,
        false,
        false
    );
    normalsTexture.name = "normals";

    return {
        diffuseTexture, specularTexture, cloudsTexture, normalsTexture
    }
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
        animate,
        ...rest
    }
) => {
    const [showError, setError] = useState(false);
    const reactCanvas = useRef(null);
    const babylonData = useRef({
        engine: null,
        resize: null,
        textureGeneratorUBuffer: null,
        textureGeneratorShader: null,
        width: 0,
        height: 0,
        normalsShader: null,
        normalsUBuffer: null,
    });

    function updateTerrain() {
        if (!babylonData.current.textureGeneratorUBuffer) {
            return;
        }

        babylonData.current.textureGeneratorUBuffer.updateInt("renderType", NOISE_TYPES.LAND_NOISE);
        babylonData.current.textureGeneratorUBuffer.updateInt("textureWidth", babylonData.current.width);
        babylonData.current.textureGeneratorUBuffer.updateInt("textureHeight", babylonData.current.height);
        babylonData.current.textureGeneratorUBuffer.updateInt("surfaceSeed", surfaceSeed);
        babylonData.current.textureGeneratorUBuffer.updateInt("landSeed", landSeed);
        babylonData.current.textureGeneratorUBuffer.updateColor4("landColor1", Color3.FromHexString(landColor1), 1.0);
        babylonData.current.textureGeneratorUBuffer.updateColor4("landColor2", Color3.FromHexString(landColor2), 1.0);
        babylonData.current.textureGeneratorUBuffer.updateColor4("waterDeepColor", Color3.FromHexString(waterDeep), 1.0);
        babylonData.current.textureGeneratorUBuffer.updateColor4("waterShallowColor", Color3.FromHexString(waterShallow), 1.0);
        babylonData.current.textureGeneratorUBuffer.updateFloat("waterLevel", waterLevel);
        babylonData.current.textureGeneratorUBuffer.updateFloat("waterSpecular", waterSpecular);
        babylonData.current.textureGeneratorUBuffer.updateFloat("waterFalloff", waterFalloff);
        updateNoiseSettings(babylonData.current.textureGeneratorUBuffer, "surfaceNoise", {
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
        updateNoiseSettings(babylonData.current.textureGeneratorUBuffer, "landNoise", {
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
        babylonData.current.textureGeneratorUBuffer.update();
        babylonData.current.textureGeneratorShader.dispatch(babylonData.current.width, babylonData.current.height, 1);
        updateNormals();
    }

    function updateNormals() {
        if (!babylonData.current.normalsUBuffer) {
            return;
        }

        babylonData.current.normalsUBuffer.updateFloat("normalScale", normalScale);
        babylonData.current.normalsUBuffer.update();
        babylonData.current.normalsShader.dispatch(babylonData.current.width, babylonData.current.height, 1);
    }

    function updateClouds() {
        if (!babylonData.current.textureGeneratorUBuffer) {
            return;
        }

        babylonData.current.textureGeneratorUBuffer.updateInt("renderType", NOISE_TYPES.CLOUD_NOISE);
        babylonData.current.textureGeneratorUBuffer.updateInt("textureWidth", babylonData.current.width);
        babylonData.current.textureGeneratorUBuffer.updateInt("textureHeight", babylonData.current.height);
        babylonData.current.textureGeneratorUBuffer.updateInt("cloudSeed", cloudSeed);
        babylonData.current.textureGeneratorUBuffer.updateColor4("cloudColor", Color3.FromHexString(cloudColor), cloudOpacity);
        updateNoiseSettings(babylonData.current.textureGeneratorUBuffer, "cloudNoise", {
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
        babylonData.current.textureGeneratorUBuffer.update();
        babylonData.current.textureGeneratorShader.dispatch(babylonData.current.width, babylonData.current.height, 1);
    }

    // set up basic engine and scene
    useEffect(
        () => {
            let isComponentMounted = true;

            async function initBabylon() {
                const {current: canvas} = reactCanvas;
                if (canvas === null) {
                    return;
                }

                const engineOptions = {
                    adaptToDeviceRatio: true,
                    antialias: true,
                    audioEngine: false,
                    doNotHandleTouchAction: true
                };

                const engine = await new WebGPUEngine(canvas, engineOptions);
                if (!isComponentMounted) {
                    // The component may have been unmounted before getting here, so bail on further setup
                    return;
                }
                babylonData.current.engine = engine;
                await babylonData.current.engine.initAsync();

                if (!babylonData.current.engine.getCaps().supportComputeShaders) {
                    setError(true);
                    return;
                }

                const scene = new Scene(babylonData.current.engine, {});
                //Inspector.Show(scene, {});
                scene.clearColor = new Color4(0, 0, 0, 0);

                const camera = new FreeCamera("camera1", new Vector3(0, 0, -2.15), scene);
                camera.setTarget(Vector3.Zero());

                const light = new DirectionalLight("light", new Vector3(1, -1, 1), scene);
                light.intensity = 0.9;

                const segments = 32;
                const planetMesh = MeshBuilder.CreateSphere("planet", {diameter: 1, segments}, scene);
                const cloudsMesh = MeshBuilder.CreateSphere("clouds", {diameter: 1.01, segments}, scene);

                const textureResolution = nearestPowerOfTwo(resolution);    // Resolution must be bumped up to the nearest power of 2
                babylonData.current.width = textureResolution;
                babylonData.current.height = textureResolution / 2.0; // Textures must be 2:1 aspect ratio to wrap properly

                const {
                    diffuseTexture,
                    specularTexture,
                    cloudsTexture,
                    normalsTexture
                } = createTextures(
                    babylonData.current.width,
                    babylonData.current.height,
                    scene
                );

                // START TEXTURE GENERATOR SHADER
                babylonData.current.textureGeneratorShader = new ComputeShader(
                    "Texture Generator Shader",
                    babylonData.current.engine,
                    {
                        computeSource: textureGeneratorShaderSource
                    },
                    {
                        bindingsMapping:
                            {
                                "uniforms": {group: 0, binding: 0},
                                "diffuseTexture": {group: 1, binding: 0},
                                "specularTexture": {group: 1, binding: 1},
                                "cloudsTexture": {group: 1, binding: 2},
                            }
                    }
                );

                babylonData.current.textureGeneratorUBuffer = new UniformBuffer(
                    babylonData.current.engine,
                    undefined,
                    undefined,
                    "Texture Generator Buffer"
                );
                // NOTE: Despite having a name param, uniforms must be added in the same order as they appear in the
                //       shader!  Updates can happen in an arbitrary order, however.
                addNoiseSettingsToBuffer(babylonData.current.textureGeneratorUBuffer, "surfaceNoise");
                addNoiseSettingsToBuffer(babylonData.current.textureGeneratorUBuffer, "landNoise");
                addNoiseSettingsToBuffer(babylonData.current.textureGeneratorUBuffer, "cloudNoise");
                addUniformsToBuffer(babylonData.current.textureGeneratorUBuffer, [
                    ["renderType", 1],
                    ["textureWidth", 1],
                    ["textureHeight", 1],
                    ["surfaceSeed", 1],
                    ["landSeed", 1],
                    ["cloudSeed", 1],
                    ["waterLevel", 1],
                    ["waterSpecular", 1],
                    ["waterFalloff", 1],
                    ["landColor1", 4],
                    ["landColor2", 4],
                    ["waterDeepColor", 4],
                    ["waterShallowColor", 4],
                    ["cloudColor", 4],
                ]);

                babylonData.current.textureGeneratorShader.setUniformBuffer("uniforms", babylonData.current.textureGeneratorUBuffer);
                babylonData.current.textureGeneratorShader.setStorageTexture("diffuseTexture", diffuseTexture);
                babylonData.current.textureGeneratorShader.setStorageTexture("specularTexture", specularTexture);
                babylonData.current.textureGeneratorShader.setStorageTexture("cloudsTexture", cloudsTexture);
                /// END TEXTURE GENERATOR SHADER

                /// START NORMALS SHADER
                babylonData.current.normalsShader = new ComputeShader(
                    "Normals Shader",
                    babylonData.current.engine,
                    {
                        computeSource: normalsGeneratorSource
                    },
                    {
                        bindingsMapping:
                            {
                                "uniforms": {group: 0, binding: 0},
                                "normalsTexture": {group: 1, binding: 0},
                                "diffuseTexture": {group: 1, binding: 1},
                            }
                    }
                );

                babylonData.current.normalsUBuffer = new UniformBuffer(
                    babylonData.current.engine,
                    undefined,
                    undefined,
                    "Normals Buffer"
                );
                addUniformsToBuffer(babylonData.current.normalsUBuffer, [
                    ["normalScale", 1],
                ]);
                babylonData.current.normalsShader.setUniformBuffer("uniforms", babylonData.current.normalsUBuffer);
                babylonData.current.normalsShader.setStorageTexture("normalsTexture", normalsTexture);
                babylonData.current.normalsShader.setStorageTexture("diffuseTexture", diffuseTexture);

                /// END NORMALS SHADER

                // Initial run for all shaders
                updateTerrain();    // normals regen is included in this
                updateClouds();

                const planetMaterial = new StandardMaterial("Planet", scene);
                planetMaterial.diffuseTexture = diffuseTexture;
                planetMaterial.specularTexture = specularTexture;
                planetMaterial.bumpTexture = normalsTexture;
                planetMesh.material = planetMaterial;

                const cloudsMaterial = new StandardMaterial("Clouds", scene);
                cloudsMaterial.diffuseTexture = cloudsTexture;
                cloudsMaterial.useAlphaFromDiffuseTexture = true;
                cloudsMesh.material = cloudsMaterial;

                // Render loop
                babylonData.current.engine.runRenderLoop(() => {
                    planetMesh.rotation.y -= 0.0003;
                    cloudsMesh.rotation.y -= 0.00025;

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
        if (babylonData.current.normalsUBuffer === null) {
            return;
        }
        updateNormals();
    }, [normalScale]);

    useEffect(() => {
        // TODO: handle resolution changes without needing to restart Babylon (if possible)
    }, [resolution]);

    // Effect for handling generation parameter changes
    useEffect(
        () => {
            updateTerrain();
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

            animate
        ]
    );

    useEffect(() => {
        updateClouds();
    }, [
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
    ]);

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
