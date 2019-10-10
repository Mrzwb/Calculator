import { calculator } from '../context/CalcContext';

const _math = require('lodash/math');

export const EasyFloat = {

    precision: function(str) {
        const arr = str.split('.');
        return arr.length === 2 ? arr.pop().length : 0;
    },

    maxPrecision: function(fa, fb) {
        return Math.max(this.precision(fa),this.precision(fb));
    },

    floatAdd: function(fa, fb) {
        const len = this.maxPrecision(fa, fb);
        return _math.add(parseFloat(fa), parseFloat(fb)).toFixed(len);;
    },

    floatSubtract: function(fa, fb) {
        const len = this.maxPrecision(fa, fb);
        return _math.subtract(parseFloat(fa), parseFloat(fb)).toFixed(len);
    },

    floatMultiply: function(fa, fb) {
        const len = this.precision(fa) + this.precision(fb);
        return _math.multiply(parseFloat(fa), parseFloat(fb)).toFixed(len);
    },

    floatDivide: function (fa, fb) {
        return _math.divide(parseFloat(fa), parseFloat(fb));
    }
}


export function getCalculator(){

    let calcStack = {

        data: [],

        nextStatus : false,

        setNextStatus: function(status) {
          this.nextStatus = status;
        },

        isNextStatus: function () {
            return this.nextStatus;
        },

        isEmpty: function() {
            return this.data.length === 0;
        },

        isNotEmpty: function() {
            return !this.isEmpty();
        },

        clear: function() {
            this.data = [];
        },

        push: function(value) {
            this.data.push(value);
        },

        pop: function() {
            return this.data.pop();
        },

        shift: function() {
            return this.data.shift();
        },

        unshift: function(value) {
            this.data.unshift(value);
        }
    };

    const reduceState = (val) => {
        return { value: val || calculator.value };
    }

    const getResult = (symbol, firstNum, secondNum) => {
        let result = secondNum;
        switch(symbol) {
            case '+' :
                result = EasyFloat.floatAdd(firstNum, secondNum);
                break;
            case '-':
                result = EasyFloat.floatSubtract(firstNum, secondNum);
                break;
            case 'x':
                result = EasyFloat.floatMultiply(firstNum, secondNum);
                break;
            case '÷':
                result = EasyFloat.floatDivide(firstNum, secondNum);
                break;
            case '%':
                result = EasyFloat.floatDivide(firstNum, 100);
                break;
            default:
        }

        return ''.concat(result);
    }

    return {
        calculate: (current, next ) => {
            // 初始值
            let val = calculator.value;

            // 清零
            if (/AC/.test(next) && current !== '') {
                calcStack.clear();
                return reduceState(val);
            }

            // 输入小数点
            if (/\./.test(next) && current.search(/\./) !== -1) {
                return reduceState(current);
            }

            // 输入数字或小数点
            if (/[0-9\\.]/.test(next)) {
                if (calcStack.isNextStatus()) {
                    current = calculator.value;
                    calcStack.setNextStatus(false);
                }

                if ('0' === current && '.' !== next) {
                    val = next;
                } else if ('-0' === current && '.' !== next) {
                    val = '-' + next;
                } else {
                    val = current + next;
                }
                return reduceState(val);
            }

            // 输入正负
            if (/\+\/-/.test(next)) {
                val = /^-/.test(current) ? current.substr(1) : '-'.concat(current);
                return reduceState(val);
            }

            // 输入操作符
            if (/[\\+-÷x%]/.test(next)) {
                val = current;
                if (calcStack.isEmpty()) {
                    calcStack.push(current);
                    calcStack.push(next);
                } else {
                    if (!calcStack.isNextStatus()) {        // 非下一步输入状态, 计算值
                        const prevVal = calcStack.shift();
                        const symbol = calcStack.shift();
                        val = getResult(symbol, prevVal, current);

                        // 计算后的值入栈
                        calcStack.push(val);
                        calcStack.push(next);
                    } else {
                        const symbol = calcStack.pop();
                        if (symbol !== next) {
                            calcStack.push(next);
                        } else {
                            calcStack.push(symbol);
                        }
                    }
                }
                calcStack.setNextStatus(true);            //  等待下一步输入
                return reduceState(val);
            }

            return reduceState(val);
        }
    }
};