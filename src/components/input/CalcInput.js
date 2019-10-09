import React, {Component} from 'react';
import './CalcInput.css';
import { CalcContext } from '../../context/CalcContext';

class CalcInput extends Component {
    render() {
        const { value } = this.context;
        return <input className = "calc-input"
                      readOnly = {true}
                      value = {value}/>
    }
}

CalcInput.contextType  = CalcContext;

export default CalcInput;