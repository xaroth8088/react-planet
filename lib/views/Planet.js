import PropTypes from 'prop-types';
import React from 'react';
import Application from '../Application';

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

    componentWillUnmount() {
        this.app.deconstruct();
    }

    render() {
        return (
            <div ref={this.planetRef} {...this.props} />
        );
    }
}

export default Planet;
