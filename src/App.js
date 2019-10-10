import React from 'react';
import './App.css';
import { RoundButton , CalcPanel, EllipseButton, CalcInput} from './components'
import { CalcContext, calculator } from './context/CalcContext';
import { getCalculator } from './util/CalculateUtils';

const labels = [
    'AC','+/-','%', '÷',
    '7',  '8', '9', 'x',
    '4',  '5', '6', '-',
    '1',  '2', '3', '+',
    '0',  '.', '='
];

class App extends React.Component {

    constructor(props) {
        super(props);
        const Calculator = getCalculator();
        this.calculate = (val) => {
            const result = Calculator.calculate(this.state.value, val);
            this.setState({...this.state, ...result});
        }
        this.state = {
            value: calculator.value,
            calculate: this.calculate
        }
    }

    render() {
        return (
            <div className="App">
                <CalcPanel>
                    <CalcContext.Provider value = { this.state } >
                        <CalcInput/>
                        {
                            labels.map((label,index) =>
                                '0' === label ? <EllipseButton key = {`E-${index}`}/>
                                    : <RoundButton key = {`B-${index}`} value = {label}/>)
                        }
                    </CalcContext.Provider>
                </CalcPanel>
            </div>
        );
    }
}

export default App;
