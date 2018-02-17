$(document).ready(initApp);
var extended = false;

function callback(type,value) {
    var displayText = $('.display').text();

    switch (type) {
        case "delete":
            $('.display').text("");
            break;
        case "decimal":
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
    $('.extend').on('click',extendPanel);
}

function buttonHandler() {
    var val = $(this).text();
    var result = val;
    switch (val) {
        case 'CE':
            my_calculator.deleteLastNumber();
            break;
        case 'C':
            my_calculator.deleteItems();
            break;
        case '=':
            var history = [];
            result = my_calculator.calculateTotal(1,history);
            break;
        default:
            my_calculator.addItem(val);
            break;
    }
}

function extendPanel() {

    if(!extended) {
        extended = true;
        $('.operators').addClass("operators_extend");
        $('.left_side').addClass("left_side_extend");
        $('.calculator').addClass("calculator_extend");
        $('.extraButtons').removeClass("hidden");
    }else{
        $('.calculator').addClass("calculator_history");
        $('.main').addClass("main_history");
        $('.history').removeClass("hidden");
    }
}