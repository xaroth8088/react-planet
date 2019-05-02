import 'rc-slider/assets/index.css';
import React from 'react';
import Tooltip from 'react-simple-tooltip';

import './Controls.css';
import SliderControl from './SliderControl';

/*
TODO:
    * All controls
    * De-bounce changes
    * BUG IN LIBRARY: isn't freeing memory well?
    * OPTIMIZATION IN LIBRARY: ensure that we're not loading the library more than once
    * BUG IN LIBRARY: doesn't automatically redraw when props change
 */

function Controls({
                      surfaceSeed, setSurfaceSeed,
                      resolution, setResolution,
                      surfaceiScale, setSurfaceiScale,
                      surfaceiOctaves, setSurfaceiOctaves,
                      surfaceiFalloff, setSurfaceiFalloff,
                      surfaceiIntensity, setSurfaceiIntensity,
                      surfaceiRidginess, setSurfaceiRidginess,
                      surfacesScale, setSurfacesScale,
                      surfacesOctaves, setSurfacesOctaves,
                      surfacesFalloff, setSurfacesFalloff,
                      surfacesIntensity, setSurfacesIntensity,
}) {
    return (
        <div className="controls">
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
            <div className="control-group">
                <div className="control-group__header">
                    Surface Noise
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
            <div>
                normalScale: 0.05,
                animate: true,

                landSeed: null,
                landColor1: null,
                landColor2: null,
                landiScale: null,
                landiOctaves: null,
                landiFalloff: null,
                landiIntensity: null,
                landiRidginess: null,
                landsScale: null,
                landsOctaves: null,
                landsFalloff: null,
                landsIntensity: null,

                waterDeep: null,
                waterShallow: null,
                waterLevel: null,
                waterSpecular: null,
                waterFalloff: null,

                cloudSeed: null,
                cloudColor: null,
                cloudOpacity: null,
                cloudiScale: null,
                cloudiOctaves: null,
                cloudiFalloff: null,
                cloudiIntensity: null,
                cloudiRidginess: null,
                cloudsScale: null,
                cloudsOctaves: null,
                cloudsFalloff: null,
                cloudsIntensity: null
            </div>
        </div>
    );
}

export default Controls;
