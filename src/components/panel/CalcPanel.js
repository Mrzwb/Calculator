import React, { Component } from 'react';
import './CalcPanel.css'

class CalcPanel extends Component {

    render() {
        return (
            <div className = "container">
                {this.props.children}
            </div>
        );
    }
}

export default CalcPanel;