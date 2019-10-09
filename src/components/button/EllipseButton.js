import React, { Component } from 'react';
import './EllipseButton.css';
import RoundButton from './RoundButton';

class EllipseButton extends Component {

    static defaultProps = {
        value : '0',
    };

    render() {
        return <RoundButton className="ellipse-button" value={ this.props.value }/>
    }

}

export default EllipseButton;
