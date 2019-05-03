import React from 'react';
import * as PropTypes from 'prop-types';
import Tooltip from 'react-simple-tooltip';

function ColorControl({
                          name, tooltip, color, setColor
                      }) {
    return (
        <div className="control">
            <div className="control__label">
                <Tooltip content={tooltip}>
                    {name}
                </Tooltip>
            </div>
            <div className="control__body">
                <input
                    type="color"
                    onChange={
                        (event) => {
                            setColor(event.target.value);
                        }
                    }
                    value={color}
                />
            </div>
        </div>
    );
}

ColorControl.propTypes = {
    name: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    setColor: PropTypes.func.isRequired
};

export default ColorControl;
