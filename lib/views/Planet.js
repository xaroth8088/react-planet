import PropTypes from 'prop-types';
import React from 'react';
import Application from '../Application';

// TODO: a prop to say "don't animate this - I just want a static image", which then bypasses the THREE rendering (like the 'sprite' render does in the original)
// TODO: fall back to the 'static image' behavior whenever WebGL fails to initialize

class Planet extends React.Component {
    static propTypes = {
        fakeSetting: PropTypes.string.isRequired
    };

    constructor(...args) {
        super(...args);
        this.planetRef = React.createRef();
        this.app = null;
    }

    componentDidMount() {
        this.app = new Application(this.planetRef.current);
        this.app.update();
    }

    render() {
        return (
            <div ref={this.planetRef} {...this.props} />
        );
    }
}

export default Planet;
