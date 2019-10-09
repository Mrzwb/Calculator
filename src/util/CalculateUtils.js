import { calculator } from '../context/CalcContext';

export function getCalculator(){

    let calcStack = [];

    const getResult = (symbol, firstNum, secondNum) => {
        let result = secondNum;
        switch(symbol) {
            case '+' :
                result = parseFloat(firstNum) + parseFloat(secondNum);
                break;
            default:
        }

        return result;
    }

    return {
        calculate: (current, next ) => {
            const state = { value: calculator.value };

            // 清零
            if (/AC/.test(next) && current !== '') {
                calcStack = [];
                return state;
            }

            // 输入小数点
            if (/\./.test(next) && current.search(/\./) !== -1) {
                return { value: current };
            }

            // 输入数字或小数点
            if (/[0-9\\.]/.test(next)) {
                if ('0' === current && '.' !== next) {
                    Object.assign(state, { value: next });
                } else if ('-0' === current && '.' !== next) {
                    Object.assign(state, { value: '-' + next });
                } else {
                    Object.assign(state, { value: current + next });
                }

                return state;
            }

            // 输入正负
            if (/\+\/-/.test(next)) {
                return { value: /^-/.test(current) ? current.substr(1) : '-'.concat(current) };
            }

            // 输入操作符
            if (/[\\+-÷x]/.test(next)) {
                const len = calcStack.length;
                if (len === 0) {
                    calcStack.push(current);
                    calcStack.push(next);
                    console.info('==1==' +calcStack);
                    return { value:  current };

                } else {
                    const firstNum = calcStack.shift();
                    const symbol = calcStack.shift();
                    const secondNum = current;

                    console.info('====' +firstNum);
                    console.info('====' +symbol);
                    console.info('====' +secondNum);


                    return { value: getResult(symbol, firstNum, secondNum) };

                }




            }

            return state;
        }
    }
};