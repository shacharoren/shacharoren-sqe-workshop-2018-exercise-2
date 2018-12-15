import $ from 'jquery';
import {parseCode,useEscodegen} from './code-analyzer';
import {FillArgs,colorLines} from './subMyCode';
import {divideCode} from './divideCode';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#FillWithColor').empty();
        let userInput = $('#codePlaceholder').val();
        let json = parseCode(userInput);
        $('#parsedCode').val(JSON.stringify(json, null, 2));
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        let argsInArray = $('#argPlaceholder').val();
        let array = argsInArray.slice(1, -1).split(',').map(String);
        FillArgs(json,array);
        let redOrGreen = colorLines(fromCodeToString);
        let lines = fromCodeToString.split('\n');
        for(let j=0;j<lines.length;j++) {
            let begin = '<div';
            if(j in redOrGreen){begin+= ' style="background-color:' + redOrGreen[j] + ';">';}
            else{begin += '>';}
            $('#FillWithColor').append(begin+lines[j]+'</div>');}
    });
});