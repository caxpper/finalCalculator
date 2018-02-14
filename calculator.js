
function Calculator(callback){

    this.cb = callback;
    this.array = [];

    this.addItem = function(buttonVal){
        var lastElemIsNaN = isNaN(this.array[this.array.length-1]);

        if((!isNaN(buttonVal) || buttonVal === '.') && !lastElemIsNaN){
            this.array[this.array.length-1] += buttonVal;
            this.cb("point",this.array.join(""));
        }else if(isNaN(buttonVal) && !lastElemIsNaN){
            this.array.push(buttonVal);
            this.cb("addItem",this.array[this.array.length-1]);
        }else if(!isNaN(buttonVal) && lastElemIsNaN){
            this.array.push(buttonVal);
            this.cb("addItem",this.array[this.array.length-1]);
        }

    }

    this.deleteItems = function() {
        this.array = [];
        this.cb("delete", "");
    }

    this.calculateTotal = function(){
        var num = null;
        var operator = null;
        for(var i = 0; i < this.array.length; i++){
            if(isNaN(this.array[i])){
               operator = this.array[i];
            }else{
                if(num === null) {
                    num = parseFloat(this.array[i]);
                }else{
                    num = executeOperator(num,parseFloat(this.array[i]),operator);
                    this.cb("result",num);
                    this.array = [num];
                }
            }
        }
        return num;
    }
}

function executeOperator(num1,num2,operator){
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
            return num1 / num2;
    }
}