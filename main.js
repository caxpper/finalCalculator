$(document).ready(initApp);


function callback(type,value) {
    var displayText = $('.display').text();

    switch (type) {
        case "delete":
            $('.display').text("");
            break;
        case "point":
            $('.display').text(value);
            break;
        case "result":
            $('.display').text(value);
            break;
        case "addItem":
            displayText += value;
            $('.display').text(displayText);
            break;
        default:
            $('.display').text("");
    }
}

var my_calculator = new Calculator(callback);

function initApp(){
    attachedHandlers();
}

function attachedHandlers() {
    $('button').on('click',buttonHandler);
}

function buttonHandler() {
    var val = $(this).text();
    var result = val;
    switch (val) {
        case 'C':
        case 'CE':
            my_calculator.deleteItems();
            break;
        case '=':
            result = my_calculator.calculateTotal();
            break;
        default:
            my_calculator.addItem(val);
            break;
    }
}