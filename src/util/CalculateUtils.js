import { calculator } from '../context/CalcContext';
import Big from 'big.js/big.mjs';

export const EasyFloat = {

    floatAdd: function(fa, fb) {
        return Big(fa).plus(fb);
    },

    floatSubtract: function(fa, fb) {
        return Big(fa).minus(fb);
    },

    floatMultiply: function(fa, fb) {
        return Big(fa).times(fb);
    },

    floatDivide: function (fa, fb) {
        return Big(fa).div(fb);
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

        replace: function(index, val) {
            this.data[index] = val;
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
                calcStack.replace(1,val);
                return reduceState(val);
            }

            // 百分号
            if (/%/.test(next)) {
                val = EasyFloat.floatDivide(current,100);
                return reduceState(val);
            }

            //  输出操作
            if (/=/.test(next)) {
                if (calcStack.isNotEmpty()) {
                    const currentVal = calcStack.shift();
                    const prevVal = calcStack.shift();
                    const symbol = calcStack.shift();
                    if (calcStack.isNextStatus()) {
                        val = getResult(symbol, prevVal, currentVal);
                        calcStack.push(currentVal)
                    } else {
                        val = getResult(symbol, prevVal, current);
                        calcStack.push(current);
                        calcStack.setNextStatus(true);
                    }
                    calcStack.push(val);
                    calcStack.push(symbol);

                    console.info(calcStack.data);
                    return reduceState(val);
                }
            }

            // 输入操作符
            if (/[\\+-÷x]/.test(next)) {
                val =  current;
                if (calcStack.isEmpty()) {
                    calcStack.push(current);
                    calcStack.push(current);
                    calcStack.push(next);
                } else {
                    if (!calcStack.isNextStatus()) {                    // 非下一步输入状态, 计算值
                        calcStack.shift();
                        const prevVal = calcStack.shift();
                        const symbol = calcStack.shift();
                        val = getResult(symbol, prevVal, current);

                        // 计算后的值入栈
                        calcStack.push(current);
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
                calcStack.setNextStatus(true);                          //  等待下一步输入
                return reduceState(val);
            }

            return reduceState(val);
        }
    }
};