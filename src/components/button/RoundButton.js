import React, { Component } from 'react';
import './RoundButton.css'
import { CalcContext } from "../../context/CalcContext";
import PropTypes from 'prop-types';

class RoundButton extends Component {

    constructor(props) {
        super(props);
        this.handlePointerDown.bind(this);
    }

    handlePointerDown(event) {
        event.preventDefault();
    }

    render() {
        const { value } = this.props;
        const className = this.props.className || "round-button";
        return <CalcContext.Consumer>
                { ({ calculate }) => (
                    <button className = { className }
                            ref = {this.ref}
                            onPointerDown = { this.handlePointerDown }
                            onClick = { () => calculate(value) }>{ value }</button>
                )}
            </CalcContext.Consumer>
    }
}

RoundButton.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string
}

export default RoundButton;