import React from 'react';
import PropTypes from 'prop-types';
import Application from '../Application';

const Planet = (props) => {
    const app = new Application();
    app.update();

    return (
        <div>
            Hello, world 3. (Ha!)
        </div>
    );
};

Planet.propTypes = {

};

export default Planet;
