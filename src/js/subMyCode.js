
export let colors={};
export let bool=false;
export let argMap ={};

export function FillArgs(json,array){
    argMap=divideToArgs(json,array);
}

export function divideToArgs(json, argsArray){
    let content;
    for(let i=0;i<json.body.length;i++){
        if(json.body[i].type!='FunctionDeclaration'){
            continue;
        }
        content=json.body[i];
    }
    for (let i =0; i < content.params.length; i++){
        argMap[content.params[i]['name']] = argsArray[i];
    }
    return argMap;
}

export function colorLines(codeAfterChanges){
    let lines = codeAfterChanges.split('\n');
    for(let i=0;i<lines.length;i++){
        if((!lines[i].includes('else if ('))){
            if(!lines[i].includes('if (')){
                continue;
            }
        }
        bool = processLine(lines[i],i,bool);
    }
    return colors;
}

export function processLine(line,index){
    if(line.includes('if (') && !line.includes('else if (')){
        bool = chooseMyColor(line);
        if(bool==true){
            colors[index]='green';
        }
        else{
            colors[index]='red';
        }
        return bool;
    }
    return processElseIf(line,index);

}

export function processElseIf(line,index){
    //if(line.includes('else if (')){
    if(bool)
        colors[index] = 'red';
    else {
        bool = chooseMyColor(line);
        if(bool==true){
            colors[index]='green';
        }
        else{
            colors[index]='red';
        }
    }
    //}
    return bool;
}

export function chooseMyColor(line){
    let afterSplit = line.substring(line.indexOf('if (') + 4, line.lastIndexOf(')')).split(' ');
    for (let key in argMap) {
        if (argMap.hasOwnProperty(key)){
            let count=0;
            while(count<afterSplit.length){
                helper(afterSplit,key,count,argMap);
                count++;}}}
    return eval(afterSplit.join(' '));
}

export function helper(afterSplit,key,count,mapArgs){
    if(afterSplit[count]==key) {afterSplit[count] = mapArgs[key];}
    //else if(afterSplit[count].indexOf('[') != -1 && afterSplit[count].substring(0,afterSplit[count].indexOf('['))==key){
    //    afterSplit[count] = mapArgs[key][Number(afterSplit[count].substring(afterSplit[count].indexOf('[') + 1,afterSplit[count].indexOf(']')))];
    //}

}
