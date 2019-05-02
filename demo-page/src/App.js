import Planet from '@xaroth8088/react-planet';
import { uniqueId } from 'lodash';
import React, { useState } from 'react';
import './App.css';
import Controls from './Controls';

function App() {
    const [surfaceSeed, setSurfaceSeed] = useState(Math.random() * Number.MAX_SAFE_INTEGER);
    const [resolution, setResolution] = useState(512);
    const [surfaceiScale, setSurfaceiScale] = useState(2);
    const [surfaceiOctaves, setSurfaceiOctaves] = useState(8);
    const [surfaceiFalloff, setSurfaceiFalloff] = useState(1);
    const [surfaceiIntensity, setSurfaceiIntensity] = useState(1);
    const [surfaceiRidginess, setSurfaceiRidginess] = useState(0.5);
    const [surfacesScale, setSurfacesScale] = useState(1);
    const [surfacesOctaves, setSurfacesOctaves] = useState(0);
    const [surfacesFalloff, setSurfacesFalloff] = useState(1);
    const [surfacesIntensity, setSurfacesIntensity] = useState(1);
    return (
      <div className="App">
        <Planet
            className="planet"
            surfaceSeed={surfaceSeed}
            resolution={resolution}
            surfaceiScale={surfaceiScale}
            surfaceiOctaves={surfaceiOctaves}
            surfaceiFalloff={surfaceiFalloff}
            surfaceiIntensity={surfaceiIntensity}
            surfaceiRidginess={surfaceiRidginess}
            surfacesScale={surfacesScale}
            surfacesOctaves={surfacesOctaves}
            surfacesFalloff={surfacesFalloff}
            surfacesIntensity={surfacesIntensity}
            key={uniqueId()}
        />
        <div className="controls-container">
          <Controls
              surfaceSeed={surfaceSeed}
              setSurfaceSeed={setSurfaceSeed}
              resolution={resolution}
              setResolution={setResolution}
              surfaceiScale={surfaceiScale}
              setSurfaceiScale={setSurfaceiScale}
              surfaceiOctaves={surfaceiOctaves}
              setSurfaceiOctaves={setSurfaceiOctaves}
              surfaceiFalloff={surfaceiFalloff}
              setSurfaceiFalloff={setSurfaceiFalloff}
              surfaceiIntensity={surfaceiIntensity}
              setSurfaceiIntensity={setSurfaceiIntensity}
              surfaceiRidginess={surfaceiRidginess}
              setSurfaceiRidginess={setSurfaceiRidginess}
              surfacesScale={surfacesScale}
              setSurfacesScale={setSurfacesScale}
              surfacesOctaves={surfacesOctaves}
              setSurfacesOctaves={setSurfacesOctaves}
              surfacesFalloff={surfacesFalloff}
              setSurfacesFalloff={setSurfacesFalloff}
              surfacesIntensity={surfacesIntensity}
              setSurfacesIntensity={setSurfacesIntensity}
          />
        </div>
      </div>
    );
}

export default App;
