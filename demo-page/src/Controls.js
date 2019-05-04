import * as PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';
import React from 'react';
import Tooltip from 'react-simple-tooltip';
import ColorControl from './ColorControl';

import './Controls.css';
import SliderControl from './SliderControl';

/*
TODO:
    * De-bounce changes
    * BUG IN LIBRARY: isn't freeing memory well?
    * OPTIMIZATION IN LIBRARY: ensure that we're not loading the library more than once
    * BUG IN LIBRARY: doesn't automatically redraw when props change
 */

function Controls({
    normalScale, setNormalScale,
    resolution, setResolution,
    animate, setAnimate,

    surfaceSeed, setSurfaceSeed,
    surfaceiScale, setSurfaceiScale,
    surfaceiOctaves, setSurfaceiOctaves,
    surfaceiFalloff, setSurfaceiFalloff,
    surfaceiIntensity, setSurfaceiIntensity,
    surfaceiRidginess, setSurfaceiRidginess,
    surfacesScale, setSurfacesScale,
    surfacesOctaves, setSurfacesOctaves,
    surfacesFalloff, setSurfacesFalloff,
    surfacesIntensity, setSurfacesIntensity,

    landSeed, setLandSeed,
    landColor1, setLandColor1,
    landColor2, setLandColor2,
    landiScale, setLandiScale,
    landiOctaves, setLandiOctaves,
    landiFalloff, setLandiFalloff,
    landiIntensity, setLandiIntensity,
    landiRidginess, setLandiRidginess,
    landsScale, setLandsScale,
    landsOctaves, setLandsOctaves,
    landsFalloff, setLandsFalloff,
    landsIntensity, setLandsIntensity,

    waterDeep, setWaterDeep,
    waterShallow, setWaterShallow,
    waterLevel, setWaterLevel,
    waterSpecular, setWaterSpecular,
    waterFalloff, setWaterFalloff,

    cloudSeed, setCloudSeed,
    cloudColor, setCloudColor,
    cloudOpacity, setCloudOpacity,
    cloudiScale, setCloudiScale,
    cloudiOctaves, setCloudiOctaves,
    cloudiFalloff, setCloudiFalloff,
    cloudiIntensity, setCloudiIntensity,
    cloudiRidginess, setCloudiRidginess,
    cloudsScale, setCloudsScale,
    cloudsOctaves, setCloudsOctaves,
    cloudsFalloff, setCloudsFalloff,
    cloudsIntensity, setCloudsIntensity
}) {
    return (
        <div className="controls">
            <div className="control">
                <div className="control__label">
                    <Tooltip content="Whether the planet will spin around or not">
                        Animate
                    </Tooltip>
                </div>
                <div className="control__body">
                    <select
                        value={animate ? 1 : 0}
                        onChange={
                            (event) => {
                                setAnimate(!!parseInt(event.target.value, 10));
                            }
                        }
                    >
                        <option value={1}>true</option>
                        <option value={0}>false</option>
                    </select>
                </div>
            </div>
            <div className="control">
                <div className="control__label">
                    <Tooltip content="Higher numbers take longer to generate, but look better.">
                        Texture Resolution:
                    </Tooltip>
                </div>
                <div className="control__body">
                    <select
                        value={resolution}
                        onChange={
                            (event) => {
                                setResolution(parseInt(event.target.value, 10));
                            }
                        }
                    >
                        <option value={256}>256</option>
                        <option value={512}>512</option>
                        <option value={1024}>1024</option>
                    </select>
                </div>
            </div>
            <SliderControl
                name="normalScale"
                tooltip="Affects lighting of the terrain"
                min={0}
                max={1}
                step={0.01}
                value={normalScale}
                onChange={setNormalScale}
            />
            <div className="control-group">
                <div className="control-group__header">
                    Surface Noise
                </div>
                <div>
                    This section controls the shape of the land masses.
                </div>
                <div className="control">
                    <div className="control__label">
                        <Tooltip content="Random number generator seed">
                            Seed
                        </Tooltip>
                    </div>
                    <div className="control__body">
                        <input
                            type="number"
                            value={surfaceSeed}
                            onChange={
                                (event) => {
                                    setSurfaceSeed(event.target.value);
                                }
                            }
                        />
                    </div>
                </div>
                <SliderControl
                    name="iScale"
                    tooltip="Higher numbers means more big land masses / smaller means more islands"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfaceiScale}
                    onChange={setSurfaceiScale}
                />
                <SliderControl
                    name="iOctaves"
                    tooltip="Higher numbers means more detail to landmass edges and surfaces, but slower rendering"
                    min={0}
                    max={16}
                    step={1}
                    value={surfaceiOctaves}
                    onChange={setSurfaceiOctaves}
                />
                <SliderControl
                    name="iFalloff"
                    tooltip="Higher numbers effectively means a higher ocean level"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfaceiFalloff}
                    onChange={setSurfaceiFalloff}
                />
                <SliderControl
                    name="iIntensity"
                    tooltip="Higher numbers effectively means a higher land level.  Higher values will result in mountains becoming plateaus"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfaceiIntensity}
                    onChange={setSurfaceiIntensity}
                />
                <SliderControl
                    name="iRidginess"
                    tooltip="Steepness of hills and mountains.  Higher values will result in mountains becoming plateaus"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfaceiRidginess}
                    onChange={setSurfaceiRidginess}
                />
                <SliderControl
                    name="sScale"
                    tooltip="If sOctaves is > 0, lower numbers mean less contiguous land"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfacesScale}
                    onChange={setSurfacesScale}
                />
                <SliderControl
                    name="sOctaves"
                    tooltip="Values larger than 0 affect how 'swirly' the landmasses are"
                    min={0}
                    max={16}
                    step={1}
                    value={surfacesOctaves}
                    onChange={setSurfacesOctaves}
                />
                <SliderControl
                    name="sFalloff"
                    tooltip="If sOctaves is > 0, affects how 'smeary' the swirls are"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfacesFalloff}
                    onChange={setSurfacesFalloff}
                />
                <SliderControl
                    name="sIntensity"
                    tooltip="If sOctaves is > 0, higher values make for thinner swirls"
                    min={0}
                    max={5}
                    step={0.1}
                    value={surfacesIntensity}
                    onChange={setSurfacesIntensity}
                />
            </div>
            <div className="control-group">
                <div className="control-group__header">
                    Land Noise
                </div>
                <div>
                    This section controls the mix between the two land colors.
                </div>
                <div className="control">
                    <div className="control__label">
                        <Tooltip content="Random number generator seed">
                            Seed
                        </Tooltip>
                    </div>
                    <div className="control__body">
                        <input
                            type="number"
                            value={landSeed}
                            onChange={
                                (event) => {
                                    setLandSeed(event.target.value);
                                }
                            }
                        />
                    </div>
                </div>
                <ColorControl
                    setColor={setLandColor1}
                    color={landColor1}
                    name="color1"
                    tooltip="Primary land color"
                />
                <ColorControl
                    setColor={setLandColor2}
                    color={landColor2}
                    name="color2"
                    tooltip="Secondary land color"
                />
                <SliderControl
                    name="iScale"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landiScale}
                    onChange={setLandiScale}
                />
                <SliderControl
                    name="iOctaves"
                    tooltip="???"
                    min={0}
                    max={16}
                    step={1}
                    value={landiOctaves}
                    onChange={setLandiOctaves}
                />
                <SliderControl
                    name="iFalloff"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landiFalloff}
                    onChange={setLandiFalloff}
                />
                <SliderControl
                    name="iIntensity"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landiIntensity}
                    onChange={setLandiIntensity}
                />
                <SliderControl
                    name="iRidginess"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landiRidginess}
                    onChange={setLandiRidginess}
                />
                <SliderControl
                    name="sScale"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landsScale}
                    onChange={setLandsScale}
                />
                <SliderControl
                    name="sOctaves"
                    tooltip="???"
                    min={0}
                    max={16}
                    step={1}
                    value={landsOctaves}
                    onChange={setLandsOctaves}
                />
                <SliderControl
                    name="sFalloff"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landsFalloff}
                    onChange={setLandsFalloff}
                />
                <SliderControl
                    name="sIntensity"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={landsIntensity}
                    onChange={setLandsIntensity}
                />
            </div>
            <div className="control-group">
                <div className="control-group__header">
                    Water Rendering
                </div>
                <ColorControl
                    setColor={setWaterDeep}
                    color={waterDeep}
                    name="Deep"
                    tooltip="The color of deep water"
                />
                <ColorControl
                    setColor={setWaterShallow}
                    color={waterShallow}
                    name="Shallow"
                    tooltip="The color of shallow water"
                />
                <SliderControl
                    name="Level"
                    tooltip="The level of the ocean"
                    min={0}
                    max={1}
                    step={0.01}
                    value={waterLevel}
                    onChange={setWaterLevel}
                />
                <SliderControl
                    name="Specular"
                    tooltip="Higher values means shinier water"
                    min={0}
                    max={5}
                    step={0.1}
                    value={waterSpecular}
                    onChange={setWaterSpecular}
                />
                <SliderControl
                    name="Falloff"
                    tooltip="Higher values means more deep water"
                    min={0}
                    max={5}
                    step={0.1}
                    value={waterFalloff}
                    onChange={setWaterFalloff}
                />
            </div>
            <div className="control-group">
                <div className="control-group__header">
                    Clouds
                </div>
                <div className="control">
                    <div className="control__label">
                        <Tooltip content="Random number generator seed">
                            Seed
                        </Tooltip>
                    </div>
                    <div className="control__body">
                        <input
                            type="number"
                            value={cloudSeed}
                            onChange={
                                (event) => {
                                    setCloudSeed(event.target.value);
                                }
                            }
                        />
                    </div>
                </div>
                <ColorControl
                    setColor={setCloudColor}
                    color={cloudColor}
                    name="Color"
                    tooltip="The color of the clouds"
                />
                <SliderControl
                    name="Opacity"
                    tooltip="How see-through are the clouds?"
                    min={0}
                    max={1}
                    step={0.05}
                    value={cloudOpacity}
                    onChange={setCloudOpacity}
                />
                <SliderControl
                    name="iScale"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudiScale}
                    onChange={setCloudiScale}
                />
                <SliderControl
                    name="iOctaves"
                    tooltip="???"
                    min={0}
                    max={16}
                    step={1}
                    value={cloudiOctaves}
                    onChange={setCloudiOctaves}
                />
                <SliderControl
                    name="iFalloff"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudiFalloff}
                    onChange={setCloudiFalloff}
                />
                <SliderControl
                    name="iIntensity"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudiIntensity}
                    onChange={setCloudiIntensity}
                />
                <SliderControl
                    name="iRidginess"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudiRidginess}
                    onChange={setCloudiRidginess}
                />
                <SliderControl
                    name="sScale"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudsScale}
                    onChange={setCloudsScale}
                />
                <SliderControl
                    name="sOctaves"
                    tooltip="???"
                    min={0}
                    max={16}
                    step={1}
                    value={cloudsOctaves}
                    onChange={setCloudsOctaves}
                />
                <SliderControl
                    name="sFalloff"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudsFalloff}
                    onChange={setCloudsFalloff}
                />
                <SliderControl
                    name="sIntensity"
                    tooltip="???"
                    min={0}
                    max={5}
                    step={0.1}
                    value={cloudsIntensity}
                    onChange={setCloudsIntensity}
                />
            </div>
        </div>
    );
}

Controls.propTypes = {
    normalScale: PropTypes.number.isRequired,
    setNormalScale: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    setResolution: PropTypes.number.isRequired,
    animate: PropTypes.number.isRequired,
    setAnimate: PropTypes.number.isRequired,

    surfaceSeed: PropTypes.number.isRequired,
    setSurfaceSeed: PropTypes.number.isRequired,
    surfaceiScale: PropTypes.number.isRequired,
    setSurfaceiScale: PropTypes.number.isRequired,
    surfaceiOctaves: PropTypes.number.isRequired,
    setSurfaceiOctaves: PropTypes.number.isRequired,
    surfaceiFalloff: PropTypes.number.isRequired,
    setSurfaceiFalloff: PropTypes.number.isRequired,
    surfaceiIntensity: PropTypes.number.isRequired,
    setSurfaceiIntensity: PropTypes.number.isRequired,
    surfaceiRidginess: PropTypes.number.isRequired,
    setSurfaceiRidginess: PropTypes.number.isRequired,
    surfacesScale: PropTypes.number.isRequired,
    setSurfacesScale: PropTypes.number.isRequired,
    surfacesOctaves: PropTypes.number.isRequired,
    setSurfacesOctaves: PropTypes.number.isRequired,
    surfacesFalloff: PropTypes.number.isRequired,
    setSurfacesFalloff: PropTypes.number.isRequired,
    surfacesIntensity: PropTypes.number.isRequired,
    setSurfacesIntensity: PropTypes.number.isRequired,

    landSeed: PropTypes.number.isRequired,
    setLandSeed: PropTypes.number.isRequired,
    landColor1: PropTypes.number.isRequired,
    setLandColor1: PropTypes.number.isRequired,
    landColor2: PropTypes.number.isRequired,
    setLandColor2: PropTypes.number.isRequired,
    landiScale: PropTypes.number.isRequired,
    setLandiScale: PropTypes.number.isRequired,
    landiOctaves: PropTypes.number.isRequired,
    setLandiOctaves: PropTypes.number.isRequired,
    landiFalloff: PropTypes.number.isRequired,
    setLandiFalloff: PropTypes.number.isRequired,
    landiIntensity: PropTypes.number.isRequired,
    setLandiIntensity: PropTypes.number.isRequired,
    landiRidginess: PropTypes.number.isRequired,
    setLandiRidginess: PropTypes.number.isRequired,
    landsScale: PropTypes.number.isRequired,
    setLandsScale: PropTypes.number.isRequired,
    landsOctaves: PropTypes.number.isRequired,
    setLandsOctaves: PropTypes.number.isRequired,
    landsFalloff: PropTypes.number.isRequired,
    setLandsFalloff: PropTypes.number.isRequired,
    landsIntensity: PropTypes.number.isRequired,
    setLandsIntensity: PropTypes.number.isRequired,

    waterDeep: PropTypes.number.isRequired,
    setWaterDeep: PropTypes.number.isRequired,
    waterShallow: PropTypes.number.isRequired,
    setWaterShallow: PropTypes.number.isRequired,
    waterLevel: PropTypes.number.isRequired,
    setWaterLevel: PropTypes.number.isRequired,
    waterSpecular: PropTypes.number.isRequired,
    setWaterSpecular: PropTypes.number.isRequired,
    waterFalloff: PropTypes.number.isRequired,
    setWaterFalloff: PropTypes.number.isRequired,

    cloudSeed: PropTypes.number.isRequired,
    setCloudSeed: PropTypes.number.isRequired,
    cloudColor: PropTypes.number.isRequired,
    setCloudColor: PropTypes.number.isRequired,
    cloudOpacity: PropTypes.number.isRequired,
    setCloudOpacity: PropTypes.number.isRequired,
    cloudiScale: PropTypes.number.isRequired,
    setCloudiScale: PropTypes.number.isRequired,
    cloudiOctaves: PropTypes.number.isRequired,
    setCloudiOctaves: PropTypes.number.isRequired,
    cloudiFalloff: PropTypes.number.isRequired,
    setCloudiFalloff: PropTypes.number.isRequired,
    cloudiIntensity: PropTypes.number.isRequired,
    setCloudiIntensity: PropTypes.number.isRequired,
    cloudiRidginess: PropTypes.number.isRequired,
    setCloudiRidginess: PropTypes.number.isRequired,
    cloudsScale: PropTypes.number.isRequired,
    setCloudsScale: PropTypes.number.isRequired,
    cloudsOctaves: PropTypes.number.isRequired,
    setCloudsOctaves: PropTypes.number.isRequired,
    cloudsFalloff: PropTypes.number.isRequired,
    setCloudsFalloff: PropTypes.number.isRequired,
    cloudsIntensity: PropTypes.number.isRequired,
    setCloudsIntensity: PropTypes.number.isRequired
};

export default Controls;
