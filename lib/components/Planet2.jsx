import {useEffect, useRef, useState} from "react";
import {
    Color3,
    Color4,
    ComputeShader,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    RawTexture,
    Scene,
    StandardMaterial,
    UniformBuffer,
    Vector3,
    WebGPUEngine
} from "@babylonjs/core";
import PropTypes from "prop-types";
import {createShuffle} from "fast-shuffle";
import memoize from "memoize";

const wgslcode = import.meta.glob('../wgsl/includes/*.wgsl', {as: 'raw', eager: true});
const terrainShaderSource = Object.values(wgslcode).join('\n');

// TODO: move these to a util file, to declutter this component
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

function addUniformsToBuffer(uBuffer, uniforms) {
    console.log("adding uniforms...");

    uniforms.forEach(
        uniform => {
            uBuffer.addUniform(uniform[0], uniform[1]);
        }
    );
}

const memoizedPermutationsFunction = memoize(generatePermutationsTable);

function generatePermutationsTable(seed) {
    // TODO: memoize this function
    // Create a permutation table for the noise generation
    // These need to be a randomized array of integers from 0 to 288 (inc.), duplicated (Isn't optimization fun?)
    const shuffler = createShuffle(seed);
    const permutations = shuffler(Array(289).fill(0).map(Number.call, Number));

    // TODO: maybe the %289's in the shader aren't as bad as passing the params list in twice...
    const retval = new Int32Array(578);
    retval.set([...permutations, ...permutations])
    return retval;
}

function updateNoiseSettings(uBuffer, name, data) {
    uBuffer.updateFloat(`${name}.iScale`, data.iScale);
    uBuffer.updateInt(`${name}.iOctaves`, data.iOctaves);
    uBuffer.updateFloat(`${name}.iFalloff`, data.iFalloff);
    uBuffer.updateFloat(`${name}.iIntensity`, data.iIntensity);
    uBuffer.updateFloat(`${name}.iRidginess`, data.iRidginess);
    uBuffer.updateFloat(`${name}.sScale`, data.sScale);
    uBuffer.updateInt(`${name}.sOctaves`, data.sOctaves);
    uBuffer.updateFloat(`${name}.sFalloff`, data.sFalloff);
    uBuffer.updateFloat(`${name}.sIntensity`, data.sIntensity);
}

function addNoiseSettingsToBuffer(uBuffer, name) {
    addUniformsToBuffer(
        uBuffer,
        [
            [`${name}.iScale`, 1],
            [`${name}.iOctaves`, 1],
            [`${name}.iFalloff`, 1],
            [`${name}.iIntensity`, 1],
            [`${name}.iRidginess`, 1],
            [`${name}.sScale`, 1],
            [`${name}.sOctaves`, 1],
            [`${name}.sFalloff`, 1],
            [`${name}.sIntensity`, 1],
            [`${name}.padding0`, 1],
            [`${name}.padding1`, 1],
            [`${name}.padding2`, 1]
        ]
    );
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
    const babylonData = useRef({engine: null, resize: null, uBuffer: null, terrainShader: null, width: 0, height: 0});

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
        updateNoiseSettings(babylonData.current.uBuffer, "surfaceNoise", {
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
        updateNoiseSettings(babylonData.current.uBuffer, "landNoise", {
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
        updateNoiseSettings(babylonData.current.uBuffer, "cloudNoise", {
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
            let isMounted = true;

            async function initBabylon() {
                const {current: canvas} = reactCanvas;

                if (!canvas) return;

                const engineOptions = {
                    adaptToDeviceRatio: true,
                    antialias: true,
                    audioEngine: false,
                    doNotHandleTouchAction: true
                };
                const sceneOptions = {};

                const engine = await new WebGPUEngine(canvas, engineOptions);
                await engine.initAsync();

                if (!engine.getCaps().supportComputeShaders) {
                    if (isMounted) {
                        setError(true);
                    }
                    return;
                }

                const scene = new Scene(engine, sceneOptions);
                scene.clearColor = new Color4(0, 0, 0, 0);

                // TODO: get it so that the planet always fits in the canvas, regardless of container size
                const camera = new FreeCamera("camera1", new Vector3(0, 0, -2.15), scene);
                camera.setTarget(Vector3.Zero());

                const light = new HemisphericLight("light", new Vector3(-8, 8, -2), scene);
                light.intensity = 0.7;

                const segments = 32;    // TODO: make this configurable via a prop
                const planetMesh = MeshBuilder.CreateSphere("planet", {diameter: 1, segments}, scene);
                const cloudsMesh = MeshBuilder.CreateSphere("clouds", {diameter: 1.01, segments}, scene);

                babylonData.current.terrainShader = new ComputeShader(
                    "Terrain Shader",
                    engine,
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

                babylonData.current.uBuffer = new UniformBuffer(engine);
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
                planetMaterial.bumpTexture = normalTexture; // TODO: something's wrong with this
                planetMesh.material = planetMaterial;

                const cloudsMaterial = new StandardMaterial("Clouds", scene);
                cloudsMaterial.diffuseTexture = cloudsTexture;
                cloudsMaterial.useAlphaFromDiffuseTexture = true;
                cloudsMesh.material = cloudsMaterial;

                engine.runRenderLoop(() => {
                    // TODO: Toggle based on animate property
                    // TODO: make rotation speeds a prop
                    planetMesh.rotation.y -= 0.0002;
                    cloudsMesh.rotation.y -= 0.0001;

                    // TODO: maybe we can have the clouds be more dynamic by slowly moving the sphereMap around within the
                    //       simplex noise space in a wandering loop (and regenerating the texture each time)?
                    scene.render();
                });

                const resize = () => {
                    engine.resize();
                };

                if (window) {
                    window.addEventListener("resize", resize);
                }

                babylonData.current.engine = engine;
                babylonData.current.resize = resize;
            }

            initBabylon();

            return () => {
                isMounted = false;
                if (babylonData.current.engine) {
                    babylonData.current.engine.dispose();
                }

                if (window) {
                    window.removeEventListener("resize", babylonData.current.resize);
                }
            };
        },
        [resolution]
    );

    // Effect for handling generation parameter changes
    useEffect(
        () => {
            // TODO: This looks like it'd be better as individual useEffect's instead of one giant one
            //       so that less uniforms data is updated every time.
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
