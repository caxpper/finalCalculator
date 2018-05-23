$(document).ready(initApp);
var extra_flag = false;
var history_flag = false;
const symbolTranslator = {
    1:'1',
    2:'2',
    3:'3',
    4:'4',
    5:'5',
    6:'6',
    7:'7',
    8:'8',
    9:'9',
    0:'0',
    '.':'dec',
    '=':'eq',
    '/':'div',
    'x':'mul',
    '-':'sub',
    '+':'add',
    '±':'neg',
    'n!':'fac',
    '√':'sqr',
    'sin':'sin',
    'log':'log',
    'cos':'cos',
    '(':'op',
    'tan':'tan',
    ')':'cp',
    '^':'exp',
}

function callback(type,value) {
    var currentText = $('.current').text();
    var previousText = $('.previous').text();

    switch (type) {
        case "delete":
            $('.previous').text("");
            $('.current').text("");
            break;
        case "special":
            $('.current').text(value);
            break;
        case "result":
            $('.previous').text("");
            $('.current').text(value);
            break;
        case "operator":
            newText = previousText + " " + currentText + " " + value;
            $('.previous').text(newText);
            $('.current').text("");
            break;
        case "addItem":
            currentText += value;
            $('.current').text(currentText);
            break;
        default:
            $('.previous').text("");
            $('.current').text("");
    }
}

var my_calculator = new Calculator(callback);

function initApp(){
    my_calculator.setJqueryHistoryElement($('.history'));
    attachedHandlers();
}

function attachedHandlers() {
    $('button').on('click',buttonHandler);
    $('.extra_extend').on('click',extendPanel);
    $('.history_extend').on('click',extendHistory);
    $('#test').on('click',()=>test(testList,0));
}

function buttonHandler() {
    var val = $(this).text();
    var result = val;
    processItem(val);
}

function processItem(val){
    switch (val) {
        case 'CE':
            my_calculator.deleteLastNumber();
            break;
        case 'C':
            my_calculator.deleteItems();
            break;
        case '=':
            result = my_calculator.calculateTotal(1);
            break;
        default:
            my_calculator.addItem(val);
            break;
    }
}

function test(caculationList,indexCalculation){
    processOneCalculation(caculationList,indexCalculation,0);
}

function processOneCalculation(caculationList,indexCalculation,index){
    setTimeout(()=>{
        let element = $('#'+symbolTranslator[caculationList[indexCalculation][index]]);
        element.addClass('active');
        setTimeout(()=>{
            element.removeClass('active');
        },150);
        processItem(caculationList[indexCalculation][index]); 
        index++;
        if(index < caculationList[indexCalculation].length){
            processOneCalculation(caculationList,indexCalculation,index);
        }else{
            indexCalculation++;
            if(indexCalculation < caculationList.length){
                test(caculationList,indexCalculation);
            }
        }
    },500);
}

function extendPanel() {
    if(extra_flag) {
        extra_flag = false;
        $('.operators').removeClass("operators_extend");
        $('.left_side').removeClass("left_side_extend");
        $('.calculator').removeClass("calculator_extend");
        $('.calculator').removeClass("calculator_history_extend");
        $('.main').removeClass("main_history_extend");
        if(history_flag){
            $('.calculator').addClass("calculator_history");
            $('.main').addClass("main_history");
        }
        $('.extraButtons').addClass("hidden");
        $('.extra_extend').text('►');
        $('.display').removeClass('display_extend');
    }else {
        extra_flag = true;
        $('.operators').addClass("operators_extend");
        $('.left_side').addClass("left_side_extend");
        $('.calculator').addClass("calculator_extend");
        $('.extraButtons').removeClass("hidden");
        $('.extra_extend').text('◄');
        if (history_flag) {
            $('.display').addClass('display_extend');
            $('.calculator').addClass("calculator_history_extend");
            $('.calculator').removeClass("calculator_extend");
            $('.main').addClass("main_history_extend");
        }
    }
}


function extendHistory(){
    if(!history_flag){
        history_flag = true;
        $('.calculator').addClass("calculator_history");
        $('.calculator').removeClass("calculator_extend");
        $('.main').addClass("main_history");
        $('.history').removeClass("hidden");
        $('.history_extend').text('►');
        if(extra_flag) {
            $('.display').addClass('display_extend');
            $('.main').removeClass("main_history");
            $('.main').addClass("main_history_extend");
            $('.calculator').removeClass("calculator_history");
            $('.calculator').addClass("calculator_history_extend");
        }
    }else{
        history_flag = false;
        $('.calculator').removeClass("calculator_history_extend");
        $('.calculator').removeClass("calculator_history");
        $('.main').removeClass("main_history");
        $('.main').removeClass("main_history_extend");
        if(extra_flag){
            $('.calculator').addClass("calculator_extend");
        }
        $('.history').addClass("hidden");
        $('.history_extend').text('◄ History');
        $('.display').removeClass('display_extend');

    }

}

