
function Calculator(callback){

    const error = "Error";
    const specialOperatorsStr = 'sincostansqrtlogn!';
    const firstIterationOperators = "xX*/^";
    this.cb = callback;
    this.array = [];
    this.history = [];
    this.finalHistory = [];
    this.parenthesisArray = [];
    this.parenthesis = 0;
    this.specialOperator = false;
    this.historyElement = null;

    /**
     *
     * @param buttonVal
     */
    this.addItem = function(buttonVal) {
        
        var lastElemIsNaN = isNaN(this.array[this.array.length - 1]);

        if (this.array[this.array.length - 1] === error) {
            this.deleteItems();
        }
        if (buttonVal === '(') { //open parenthesis
            if (lastElemIsNaN && this.array[this.array.length - 1] !== ')') {
                this.parenthesis++;
                this.array.push(buttonVal);
                this.cb("addItem", this.array[this.array.length - 1]);
            }
        } else if (buttonVal === ')') { //close parenthesis
            if ((!lastElemIsNaN || this.array[this.array.length - 1] === ')' || this.specialOperator) && this.parenthesis > 0) {
                this.parenthesis--;
                this.array.push(buttonVal);
                this.cb("addItem", this.array[this.array.length - 1]);
            }
        } else if (buttonVal === '±') {//change sign
            if (!lastElemIsNaN) {
                this.array[this.array.length - 1] *= -1; //we do directly here
                this.cb("special", this.array.join(""));
            }
        }else if(buttonVal === '√'){ //square root
            if (!lastElemIsNaN) { //change sign
                this.specialOperator = true; //we indicate exist a special operator to control when we resolve the equation
                this.array[this.array.length - 1] = 'sqrt('+this.array[this.array.length - 1]+')';
                this.cb("special", this.array.join(""));
            }
        }else if(buttonVal === 'log' || buttonVal === 'sin' || buttonVal === 'cos'
            || buttonVal === 'tan' || buttonVal === 'n!') {//special operators
            if (!lastElemIsNaN) {
                this.specialOperator = true;
                this.array[this.array.length - 1] = buttonVal + '('+this.array[this.array.length - 1]+')';
                this.cb("special", this.array.join(""));
            }
        }else if(buttonVal === '.'){// && !lastElemIsNaN) { //decimals
            if(this.countCharactersOnCurrentDisplay(this.array) <= 10){
                if(this.history.length > 0){//first key pressed
                    this.history = [];
                    this.array = [];
                    this.array.push('0.'); //we add the 0
                    this.cb("special", this.array[this.array.length - 1]);
                }else if(lastElemIsNaN){                                        
                    this.array.push('0.'); //we add the 0
                    this.cb("special", this.array[this.array.length - 1]);
                }else {//after a number
                    var num_aux = parseInt(this.array[this.array.length - 1]);
                    num_aux += buttonVal; //we go the number and add the dot
                    this.array[this.array.length - 1] = num_aux; //sustitute the old number
                    this.cb("special", this.array[this.array.length - 1]);
                }
            }
        }else if(!isNaN(buttonVal) && !lastElemIsNaN){ //2 or more numbers
            if(this.countCharactersOnCurrentDisplay(this.array) <= 10){
                if(this.history.length > 0){ //we check if we did an operation before
                    this.history = [];//we reset everything
                    this.array = [];
                    this.array.push(buttonVal);
                    this.cb("special", this.array[this.array.length - 1]);
                }else {
                    this.array[this.array.length - 1] += buttonVal;
                    this.cb("special", this.array[this.array.length - 1]);
                }
            }
        }else if(isNaN(buttonVal) && (!lastElemIsNaN || this.specialOperator)){//operator after number
            this.history = [];
            this.specialOperator = false;
            this.array.push(buttonVal); //add the operator
            this.cb("operator",this.array[this.array.length-1]);
        }else if(isNaN(buttonVal) && lastElemIsNaN){//operator after operator
            //Control that the operator is not a parenthesis
            if(this.array[this.array.length-1]!=='(' && this.array[this.array.length-1]!==')') {
                this.array[this.array.length - 1] = buttonVal;
                this.cb("special", this.array.join(""));
            }else{
                if(this.array[this.array.length-1]===')') { //we only accept close parenthesis
                    this.array.push(buttonVal);
                    this.cb("addItem", buttonVal);
                }
            }
        }else if(!isNaN(buttonVal) && lastElemIsNaN){//number after operator or first number
            this.array.push(buttonVal);
            this.cb("addItem", this.array[this.array.length - 1]);
        }
        

    }

    this.countCharactersOnCurrentDisplay = function(array){
        let sum = 0;
        if(array.length > 0){
            if(typeof(array[array.length-1])==='string'){
                sum += array[array.length-1].length;
            }else{
                sum += array[array.length-1].toString().length;
            } 
        }       
        return sum;
    }

    /**
     * C key. Delete the array and clean the display
     */
    this.deleteItems = function() {
        this.array = [];
        this.history = [];
        this.parenthesis = 0;
        this.cb("delete", "");
    }


    /**
     * CE key. Pop the last element of the array if it's not a operator
     */
    this.deleteLastNumber = function(){
        if(!isNaN(this.array[this.array.length-1])) {
            this.array.pop();
            this.cb("decimal", this.array.join(""));
        }
    }

    /**
     * Calculate the equation you have in your array
     * @param iteration: 1: execute first multiplied and division
     *                   2: execute everything
     * @returns {*} the result of the equation
     */
    this.calculateTotal = function(iteration,afterFirstIteration) {

        var num = null;
        if (this.array.length === 2) {//only 2 elements
            num = this.executeOperator(parseFloat(this.array[0]), parseFloat(this.array[0]), this.array[1]);
            this.history.push(this.array[0]);
            this.history.push(this.array[1]);
            this.history.push(this.array[0]);
            this.history.push('=');
            this.history.push(num);
            this.finalHistory.push(this.history);
            this.printHistory();
            this.cb("result",num);
            this.array = [num];
        }else if(this.array.length === 0){//without elements
            num = 0;
            this.cb("result",num);
            this.array = [num];
            this.history.push(this.array[0]);
            this.finalHistory.push(this.history);
            this.printHistory();
        }else {
            if(iteration===1){
                //when we only have one element and we have a previous equation done
                if (this.array.length === 1 && this.checkSpecialOperator(this.array[this.array.length-1])===-1) {
                    //this.history = this.finalHistory[this.finalHistory.length-1];
                    if(this.history !== undefined && this.history.length > 3) {
                        this.array.push(this.history[this.history.length - 4]);
                        this.array.push(this.history[this.history.length - 3]);
                    }
                }
                this.history = this.array.slice(); //we copy our array of element to the history
                this.completeParenthesis(this.array); //we complete the parenthesis the user didn't close
                this.executeSpecialOperators(this.array); //before the normal calculation we calculate the special operations
                num = this.processArray(iteration,this.array); //process the array of elements
                num = parseFloat(num.toFixed(4));
                if(num.toString.length>3)
                this.history.push('=');
                this.history.push(num);
                this.finalHistory.push(this.history); //array of array for the history
                this.printHistory(); //display the history
                this.cb("result",num);
                this.array = [num];
            }else{//iteration 2
                num = this.processArray(iteration,afterFirstIteration);
            }
        }

        return num;
    }

    /**
     *
     * @param iteration
     * @param array
     * @returns {*}
     */
    this.processArray = function (iteration, array) {
        var num = null;
        var operator = null;
        var parenthesis = 0;
        var localParenthesisArray = [];
        var afterFirstIteration = [];

        for (var i = 0; i < array.length; i++) {
            if(i===array.length-1-parenthesis && isNaN(array[i]) && array[i]!==')') {
                //when the last element is an operator
                if (iteration === 1) {
                    if (firstIterationOperators.indexOf(array[i]) !== -1) {//mult or div
                        num = this.executeOperator(num, num, array[i]);
                        afterFirstIteration.push(num);
                    } else {
                        if(parenthesis>0){//check we have open parenthesis
                            localParenthesisArray.push(array[i]);
                        }else {
                            afterFirstIteration.push(array[i]);
                        }
                    }
                } else {
                    this.history.push(num);
                    num = this.executeOperator(num, num, array[i]);
                }
            }else if (isNaN(array[i])){//operator
                if(array[i]==='('){//open parenthesis
                    parenthesis++;
                    if(parenthesis > 1){
                        //this.parenthesisArray is an array of array for nested parenthesis
                        this.parenthesisArray.push(localParenthesisArray);
                        localParenthesisArray = [];
                    }
                }else if(array[i]===')'){//close parenthesis
                    if(parenthesis > 1) {   //nested parenthesis
                        parenthesis--;
                        //we calculate the inside of the parenthesis and
                        // put in the array of the next level of parenthesis
                        var operation = this.processArray(1, localParenthesisArray);
                        localParenthesisArray = this.parenthesisArray.pop();
                        localParenthesisArray.push(operation);
                    }else{
                        parenthesis--;
                        if (firstIterationOperators.indexOf(operator)!==-1) {//if operator is first iteration (*/)
                            //execute the things outside of the parenthesis with the things inside
                            num = this.executeOperator(num, this.processArray(1, localParenthesisArray), operator);
                            localParenthesisArray = [];
                            if(num!==error) {
                                //we include the result to the array for the second iteration
                                afterFirstIteration.push(num);
                                num = null;
                            }
                        }else{
                            afterFirstIteration.push(this.processArray(1, localParenthesisArray));
                            localParenthesisArray = [];
                        }
                    }
                }else if(parenthesis>0){//nested parenthesis
                    localParenthesisArray.push(array[i]);
                }else if(iteration===1) {
                    //if we have a * or / we extract the first number from the array
                    if(firstIterationOperators.indexOf(array[i])!==-1) {
                        num = afterFirstIteration.pop();
                        operator = array[i];
                    }else{
                        afterFirstIteration.push(array[i]);
                    }
                }else{
                    operator = array[i];
                }
            }else {//number
                if (num === null) {//first number
                    if(parenthesis>0){//nested parenthesis
                        localParenthesisArray.push(array[i]);
                    }else if(iteration===1) {
                        //if it's the first iteration we save the number for the second iteration
                        //or until we find a * or /
                        afterFirstIteration.push(array[i]);
                    }else{
                        num = parseFloat(array[i]);
                    }
                } else {//second number
                    if(parenthesis>0){//nested parenthesis
                        localParenthesisArray.push(array[i]);
                    }else if(iteration===1) {
                        if (firstIterationOperators.indexOf(operator)!==-1) {
                            //if we find * or /
                            num = this.executeOperator(num, parseFloat(array[i]), operator);
                            if(num!==error) {
                                afterFirstIteration.push(num);
                                num = null;
                            }
                        }else{
                            //if it's the first iteration we save the number for the second iteration
                            afterFirstIteration.push(array[i]);
                        }
                    }else{
                        //in the second iteration we calculate any operation
                        num = this.executeOperator(num, parseFloat(array[i]), operator);
                    }
                }
            }
        }
        if(iteration===1&&num!== error) {
            //call the second iteration
            num = this.calculateTotal(2,afterFirstIteration);
        }
        return num;
    }

    /**
     * Execute the correct operation
     * @param num1
     * @param num2
     * @param operator
     * @returns {*}
     */
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
                break;
            case '^':
                return Math.pow(num1,num2);
        }
    }

    /**
     * set the element where we want to display the history
     * @param element
     */
    this.setJqueryHistoryElement = function (element) {
        this.historyElement = element;
    }

    /**
     * print the history in the display's history
     */
    this.printHistory = function () {
        this.historyElement.empty();
        for(var i = 0; i < this.finalHistory.length; i++){
            var $div = $('<div>').text(this.finalHistory[i].join(''));
            $div.addClass('history_element');
            this.historyElement.append($div);
        }
    }

    /**
     * Check if the parameter is a string and have a special operator
     *
     * @param str
     * @returns {number}
     */
    this.checkSpecialOperator = function (str){
        if(typeof(str)!=='string'){
            return -1;
        }
        if(str.length < 2){
            return -1;
        }
        return specialOperatorsStr.indexOf(str.substring(0,2));
    }

    /**
     * Complete the array and the history array with the parenthesis the user didn't close
     *
     * @param array
     */
    this.completeParenthesis = function(array){

        if(isNaN(array[array.length-1]) && array[array.length-1]!==')' && this.checkSpecialOperator(array[array.length-1])===-1 && this.parenthesis > 0){
            if(array[array.length-1]==='('){
                array.push(0);
                this.history.push(0);
            }else{
                this.history.push(array[array.length-2]);
                array.push(array[array.length-2]);
            }
        }
        for(var x = 0; x < this.parenthesis;x++)  {
            array.push(')');
            this.history.push(')');
        }
        this.parenthesis=0;
    }

    /**
     * We execute the special operations (scientific operations)
     *
     * @param array
     */
    this.executeSpecialOperators = function(array){

        for(var i = 0; i < array.length; i++){
            if(this.checkSpecialOperator(array[i])!==-1){
                var sp = array[i].substring(0,2);
                switch (sp){
                    case 'sq':
                        array[i] = Math.sqrt(this.getNumber(array[i])).toFixed(6);
                        break;
                    case 'lo':
                        array[i] = Math.log(this.getNumber(array[i])).toFixed(6);
                        break;
                    case 'n!':
                        array[i] = this.factorialize(this.getNumber(array[i])).toFixed(6);
                        break;
                    case 'si':
                        array[i] = Math.sin(this.getNumber(array[i]) * Math.PI / 180.0).toFixed(6);//we change from radians to degrees
                        break;
                    case 'co':
                        array[i] = Math.cos(this.getNumber(array[i]) * Math.PI / 180.0).toFixed(6);
                        break;
                    case 'ta':
                        array[i] = Math.tan(this.getNumber(array[i]) * Math.PI / 180.0).toFixed(6);
                        break;
                }
            }
        }
    }

    /**
     * Return the number between the parenthesis for the special operations
     *
     * @param str
     * @returns {number}
     */
    this.getNumber = function (str) {
        var number = '';
        var p = false;
        for(var indexString = 0; indexString < str.length; indexString++){
            if(str[indexString]===')'){
                p = false;
            }
            if(p){
                number += str[indexString];
            }
            if(str[indexString]==='('){
                p = true;
            }
        }
        return parseFloat(number);
    }

    /**
     * calculate the factor of the number pass in the parameter
     *
     * @param num
     * @returns {number}
     */
    this.factorialize = function (num) {
        // If the number is less than 0, reject it.
        if (num < 0) {
            return -1;

            // If the number is 0, its factorial is 1.
        } else if (num == 0) {
            return 1;

            // Otherwise, call the recursive procedure again
        } else {
            return (num * this.factorialize(num - 1));
        }
    }
}

