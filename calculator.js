
function Calculator(callback){

    const error = "Error";
    this.cb = callback;
    this.array = [];
    this.finalHistory = [];
    this.afterFirstIteration = [];
    this.parenthesisArray = [];
    this.parenthesis = 0;

    this.addItem = function(buttonVal) {
        var lastElemIsNaN = isNaN(this.array[this.array.length - 1]);

        if (this.array[this.array.length - 1] === error) {
            this.deleteItems();
        }
        if (buttonVal === '(' ) {
            if(lastElemIsNaN) {
                this.parenthesis++;
                this.array.push(buttonVal);
                this.cb("addItem", this.array[this.array.length - 1]);
            }
        }else if(buttonVal === ')'){
            if((!lastElemIsNaN || this.array[this.array.length - 1] === ')') && this.parenthesis > 0) {
                this.parenthesis--;
                this.array.push(buttonVal);
                this.cb("addItem", this.array[this.array.length - 1]);
            }
        }else if(buttonVal === '.' && !lastElemIsNaN) { //decimals
            var num_aux = parseInt(this.array[this.array.length - 1]);
            num_aux += buttonVal;
            this.array[this.array.length - 1] = num_aux;
            this.cb("decimal", this.array.join(""));
        }else if(!isNaN(buttonVal) && !lastElemIsNaN){ //2 or more numbers
            if(this.finalHistory[this.finalHistory.length-1].length > 0){
                this.array = [];
                this.array.push(buttonVal);
                this.cb("decimal", this.array);
            }else {
                this.array[this.array.length - 1] += buttonVal;
                this.cb("decimal", this.array.join(""));
            }
        }else if(isNaN(buttonVal) && !lastElemIsNaN){//operator after number
            this.array.push(buttonVal);
            this.cb("addItem",this.array[this.array.length-1]);
        }else if(isNaN(buttonVal) && lastElemIsNaN){//operator after operator
            if(this.array[this.array.length-1]!=='('&&this.array[this.array.length-1]!==')') {
                this.array[this.array.length - 1] = buttonVal;
                this.cb("decimal", this.array.join(""));
            }else{
                if(this.array[this.array.length-1]===')') {
                    this.array.push(buttonVal);
                    this.cb("addItem", buttonVal);
                }
            }
        }else if(!isNaN(buttonVal) && lastElemIsNaN){//number after operator or first number
            this.array.push(buttonVal);
            this.cb("addItem", this.array[this.array.length - 1]);
        }

    }

    this.deleteItems = function() {
        this.array = [];
        this.cb("delete", "");
    }


    this.deleteLastNumber = function(){
        if(!isNaN(this.array[this.array.length-1])) {
            this.array.pop();
            this.cb("decimal", this.array.join(""));
        }
    }

    this.calculateTotal = function(iteration,history) {

        var num = null;
        if (this.array.length === 2) {//only 2 elements
            num = this.executeOperator(parseFloat(this.array[0]), parseFloat(this.array[0]), this.array[1]);
            history.push(this.array[0]);
            history.push(this.array[1]);
            history.push(this.array[0]);
            this.finalHistory.push(history);
            this.cb("result",num);
            this.array = [num];
        }else if(this.array.length === 0){//without elements
            num = 0;
            this.cb("result",num);
            this.array = [num];
            history.push(this.array[0]);
            this.finalHistory.push(history);
        }else {
            if (this.array.length === 1) {//when we only have one operator
                history = this.finalHistory[this.finalHistory.length-1];
                this.array.push(history[history.length - 2]);
                this.array.push(history[history.length - 1]);
            }
            if(iteration===1){
                history = this.array.slice();
                num = this.processArray(iteration,this.array,history);
                this.finalHistory.push(history);
                this.printHistory();
                this.cb("result",num);
                this.array = [num];
            }else{
                num = this.processArray(iteration,this.afterFirstIteration,history);
                this.afterFirstIteration = [];
            }
        }

        return num;
    }

    this.processArray = function (iteration, array,history) {
        var num = null;
        var operator = null;
        var firstIterationOperators = "xX*/";
        var parenthesis = 0;
        var localParenthesisArray = [];

        for (var i = 0; i < array.length; i++) {
            if(i==array.length-1 && isNaN(array[i]) && array[i]!==')'){
                if(parenthesis > 0){ //last element and we still have parenthesis open, close parenthesis

                    array.push(array[i-1]);
                    history.push(array[i-1]);
                    for(var x = 0; x < parenthesis; x++ ) {
                        array.push(')');
                        history.push(')');
                    }
                    localParenthesisArray.push(array[i]);

                }else {//when the last element is an operator
                    if (iteration === 1) {
                        if (firstIterationOperators.indexOf(array[i]) !== -1) {//mult or div
                            num = this.executeOperator(num, num, array[i]);
                            this.afterFirstIteration.push(num);
                        } else {
                            this.afterFirstIteration.push(array[i]);
                        }
                    } else {
                        history.push(num);
                        num = this.executeOperator(num, num, array[i]);
                    }
                }

            }else if (isNaN(array[i])){//operator
                if(array[i]==='('){
                    parenthesis++;
                    if(parenthesis > 1){
                        this.parenthesisArray.push(localParenthesisArray);//for nested parenthesis
                        localParenthesisArray = [];
                    }
                }else if(array[i]===')'){
                    if(parenthesis > 1) {   //nested parenthesis
                        parenthesis--;
                        var operation = this.processArray(1, localParenthesisArray,history);
                        localParenthesisArray = this.parenthesisArray.pop();
                        localParenthesisArray.push(operation);
                    }else{
                        parenthesis--;
                        if (firstIterationOperators.indexOf(operator)!==-1) {//if operator is first iteration (*/)
                            num = this.executeOperator(num, this.processArray(1, localParenthesisArray), operator, history);
                            localParenthesisArray = [];
                            if(num!==error) {
                                this.afterFirstIteration.push(num);
                                num = null;
                            }
                        }else{
                            this.afterFirstIteration.push(this.processArray(2, localParenthesisArray,history));
                            localParenthesisArray = [];
                        }
                    }
                }else if(parenthesis>0){
                    localParenthesisArray.push(array[i]);
                }else if(iteration===1) {
                    if(firstIterationOperators.indexOf(array[i])!==-1) {
                        num = this.afterFirstIteration.pop();
                        operator = array[i];
                    }else{
                        this.afterFirstIteration.push(array[i]);
                    }
                }else{
                    operator = array[i];
                }
            }else {
                if (num === null) {//first number
                    if(parenthesis>0){
                        localParenthesisArray.push(array[i]);
                    }else if(iteration===1) {
                        this.afterFirstIteration.push(array[i]);
                    }else{
                        num = parseFloat(array[i]);
                    }
                } else {//second number
                    if(parenthesis>0){
                        localParenthesisArray.push(array[i]);
                    }else if(iteration===1) {
                        if (firstIterationOperators.indexOf(operator)!==-1) {
                            num = this.executeOperator(num, parseFloat(array[i]), operator);
                            if(num!==error) {
                                this.afterFirstIteration.push(num);
                                num = null;
                            }
                        }else{
                            this.afterFirstIteration.push(array[i]);
                        }
                    }else{
                        num = this.executeOperator(num, parseFloat(array[i]), operator);
                    }
                }
            }
        }
        if(iteration===1&&num!== error) {
            num = this.calculateTotal(2,history);
        }
        return num;
    }

    this.executeOperator = function(num1,num2,operator){

        switch(operator){
            case '+':
                return num1 + num2;
            case '-':
                return num1- num2;
            case 'x':
            case 'X':
            case '*':
                return num1 * num2;
            case '/':
                if(num2 === 0){
                    return error;
                }else {
                    return num1 / num2;
                }
        }
    }

    this.printHistory = function () {
        var history = $('.history');
        history.empty();
        for(var i = 0; i < this.finalHistory.length; i++){
            history.append($('<div>').text(this.finalHistory[i].join('')));
        }
    }
}

