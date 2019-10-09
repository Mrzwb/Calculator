import React from 'react';

export const calculator = {
    value: '0',
    calculate: (val) => {},
};

export const CalcContext = React.createContext(
    calculator
);