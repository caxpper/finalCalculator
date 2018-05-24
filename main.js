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
    '*':'mul',
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
    '^':'exp'
}
const keyTranslator = {
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
    '.':'.',
    '=':'=',
    '/':'/',
    '*':'*',
    '-':'-',
    '+':'+',
    '!':'n!',
    '@':'√',
    's':'sin',
    'l':'log',
    'c':'cos',
    '(':'(',
    'tan':'tan',
    ')':')',
    'y':'^'
}
const validKeys = '1234567890.+=/*-!@slct()y';

var testAvailable = true;

function callback(type,value) {
    var currentText = $('.current').val();
    var previousText = $('.previous').text();

    switch (type) {
        case "delete":
            $('.previous').text("");
            $('.current').val("");
            break;
        case "special":
            $('.current').val(value);
            break;
        case "result":
            $('.previous').text("");
            $('.current').val(value);
            break;
        case "operator":
            newText = previousText + " " + currentText + " " + value;
            $('.previous').text(newText);
            $('.current').val("");
            break;
        case "addItem":
            currentText += value;
            $('.current').val(currentText);
            break;
        default:
            $('.previous').text("");
            $('.current').val("");
    }
}

var my_calculator = new Calculator(callback);

function initApp(){
    my_calculator.setJqueryHistoryElement($('.history'));
    attachedHandlers();
}

function attachedHandlers() {
    $('button').on('click',buttonHandler);
    $('.view').on('click',extendMenu);
    $('#standard').on('click',standardView);
    $('#scientific').on('click',scientificView);
    $('#history').on('click',()=>extendHistory(false));
    $('#test').on('click',runTest);
    $('.test').on('click',runTest);
    $('.stop').on('click',stopTest);
    $('.current').on('keypress',checkValidKey.bind(this));
}

function buttonHandler() {
    var val = $(this).text();
    processItem(val);
}

function checkValidKey(e) {
    e.preventDefault();
    var val = e.key;

    if(validKeys.indexOf(val)!==-1){
        processItem(keyTranslator[val]);
    }
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

function stopTest(){
    testAvailable = false
    $('.view').removeClass('barSelect');
    $('.menu').addClass('hide');
    my_calculator.deleteItems();
}

function runTest(){
    $('.view').removeClass('barSelect');
    $('.menu').addClass('hide');
    $('#test').unbind("click");   
    $('.test').unbind("click");  
    $('button').unbind("click");
    $('.stop').removeClass('hide'); 
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {          
        scientificView();
        extendHistory(true);       
    }
    test(testList,0);
}

function test(caculationList,indexCalculation){
    processOneCalculation(caculationList,indexCalculation,0);
}

function processOneCalculation(caculationList,indexCalculation,index){
    if(testAvailable){
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
                }else{
                    $('#test').on('click',runTest); 
                    $('.test').on('click',runTest); 
                    $('.stop').addClass('hide');          
                    $('button').on('click',buttonHandler);
                }
            }
        },500);
    }else{
        $('#test').on('click',runTest); 
        $('.test').on('click',runTest); 
        $('.stop').addClass('hide');              
        $('.previous').text("");
        $('.current').text("");       
        $('button').on('click',buttonHandler);
        testAvailable = true;
    }
}

function extendMenu() {
    $('.view').toggleClass('barSelect');
    $('.menu').toggleClass('hide');
}

function scientificView(){
    if(!extra_flag) {
        extra_flag = true;
        $('.operators').addClass("operators_extend");
        $('.left_side').addClass("left_side_extend");
        $('.calculator').addClass("calculator_extend");
        $('.extraButtons').removeClass("hidden");
        if (history_flag) {
            $('.display').addClass('display_extend');
            $('.calculator').addClass("calculator_history_extend");
            $('.calculator').removeClass("calculator_extend");
            $('.main').addClass("main_history_extend");
        }
    }
           
    $('.view').removeClass('barSelect');
    $('.menu').addClass('hide');
    $('#scientific').addClass('menuSelect');
    $('#standard').removeClass('menuSelect');

}

function standardView() {
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
        $('.display').removeClass('display_extend');
    }
    $('.view').removeClass('barSelect');
    $('.menu').addClass('hide');
    $('#standard').addClass('menuSelect');
    $('#scientific').removeClass('menuSelect');
}


function extendHistory(fromTest){
    if(!history_flag){
        history_flag = true;
        $('.calculator').addClass("calculator_history");
        $('.calculator').removeClass("calculator_extend");
        $('.main').addClass("main_history");
        $('.history').removeClass("hidden");
        if(extra_flag) {
            $('.display').addClass('display_extend');
            $('.main').removeClass("main_history");
            $('.main').addClass("main_history_extend");
            $('.calculator').removeClass("calculator_history");
            $('.calculator').addClass("calculator_history_extend");
        }
        $('#history').toggleClass('menuSelect');
    }
    else{
        if(!fromTest){
            history_flag = false;
            $('.calculator').removeClass("calculator_history_extend");
            $('.calculator').removeClass("calculator_history");
            $('.main').removeClass("main_history");
            $('.main').removeClass("main_history_extend");
            if(extra_flag){
                $('.calculator').addClass("calculator_extend");
            }
            $('.history').addClass("hidden");
            $('.display').removeClass('display_extend');
            $('#history').toggleClass('menuSelect');
        }
    } 
    $('.view').removeClass('barSelect');
    $('.menu').addClass('hide');

}

