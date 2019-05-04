import React from 'react';
import * as PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
import Tooltip from 'react-simple-tooltip';


function SliderControl({ tooltip, name, step, min, max, value, onChange }) {
    return (
        <div className="control">
            <div className="control__label">
                <Tooltip content={tooltip} placement="right">
                    {name}
                </Tooltip>
            </div>
            <div className="control__body">
                <Slider
                    step={step}
                    min={min}
                    max={max}
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>
            <div className="control__value">
                {value}
            </div>
        </div>
    );
}

SliderControl.propTypes = {
    tooltip: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default SliderControl;
