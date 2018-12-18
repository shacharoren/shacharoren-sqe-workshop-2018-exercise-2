
function resolveElements(json,localVars) {
    switch (json.type) {
    case 'Identifier':return rowIdentifier(json, localVars);
    case 'ArrayExpression':return rowArrayExpression(json, localVars);
    case 'BlockStatement':return rowBlockStatement(json, localVars);
    case 'ExpressionStatement':return rowExpressionStatement(json, localVars);
    default :return resolveElements2(json, localVars);
    }
}
function resolveElements2(json, localVars) {
    switch (json.type) {
    case 'VariableDeclaration':return rowVariableDeclaration(json, localVars);
    case 'BinaryExpression':return rowBinaryExpression(json, localVars);
    case 'UnaryExpression':return rowUnaryExpression(json, localVars);
    case'MemberExpression':return rowMemberExpression(json, localVars);
    default :return resolveElements3(json, localVars);
    }
}
function resolveElements3(json, localVars) {
    switch (json.type) {
    case'ReturnStatement':return rowReturnStatement(json, localVars);
    case 'AssignmentExpression':return rowAssignmentExpression(json, localVars);
    case 'WhileStatement':return rowWhileStatement(json, localVars);
    case 'IfStatement':return rowIfStatement(json, localVars);
    }
}

export function ridAllLocals(json, locals){
    // if(json.type == 'UpdateExpression') {
    //     return json;
    // }
    if(json.type == 'Literal') {
        return json;

    }
    return resolveElements(json,locals);
}

export function divideCode(json, locals){
    for(let i=0;i<json.body.length;i++){
        if(json.body[i].type=='FunctionDeclaration'){
            ridAllLocals(json.body[i].body, locals);
        }
        else{
            ridAllLocals(json.body[i], locals);
        }
    }
    return json;

}

export function rowIdentifier(json, locals){
    let nameOfJason=json.name;
    //if(nameOfJason) {
    if (json.name in locals) {
        json = locals[nameOfJason];
    }
    //}
    return json;
}

export function rowBlockStatement(code, locals){
    let count=0;
    while(count<code.body.length){
        code.body[count] = ridAllLocals(code.body[count], locals);

        if(!(code.body[count])) {

            delete code.body[count];
        }

        count++;
    }

    let filter=code.body.filter(value => Object.keys(value).length != 0);

    code.body = filter;

    return code;
}

export function rowArrayExpression(json, locals){
    let count=0;
    while(count<json.elements.length){
        let elem= json.elements[count];
        json.elements[count] = ridAllLocals(elem, locals);
        count++;
    }

    return json;
}

export function rowWhileStatement(json, locals){
    let copy = Object.assign({}, locals);
    json.test = ridAllLocals(json.test,locals);
    json.body = ridAllLocals(json.body,copy);
    return json;
}

export function rowVariableDeclaration(json, locals){
    let jsonInit=json.declarations[0].init;
    //  if(jsonInit) {
    json.declarations[0].init = ridAllLocals(jsonInit, locals);
    locals[json.declarations[0].id.name] = jsonInit;
    //  }

    return;
}

export function rowMemberExpression(json, locals){

    let prop=json.property.value;

    if(prop>=0&&json.object.name in locals) {
        json = locals[json.object.name].elements[prop];
    }
    return json;
}

export function rowBinaryExpression(json, locals){
    let left=json.left;
    let right=json.right;
    if(left!=null&&right!=null) {

        json.left = ridAllLocals(left, locals);
        json.right = ridAllLocals(right, locals);
    }


    return reqBinaryExpression(json);
}

export function rowExpressionStatement(json, locals){
    json.expression = ridAllLocals(json.expression,locals);

    if(!(json.expression))
    {
        //here delete exp
        delete json.expression;
        return;
    }
    return json;
}

export function rowReturnStatement(json, locals){

    //if(json.argument) {
    json.argument = ridAllLocals(json.argument, locals);
    //}
    return json;
}

export function rowAssignmentExpression(json, locals){
    let name;
    json.right = ridAllLocals(json.right,locals);
    if(json.left.type=='Identifier'){name = json.left.name;}
    else{name = json.left.object.name;}
    if(name in locals) {
        // if (json.left.type != 'Identifier') {
        //     locals[json.left.object.name].elements[json.left.property.value] = json.right;
        // }
        //  else {locals[json.left.name] = json.right;}
        locals[json.left.name] = json.right;
        return;
    }
    else if (json.left.type == 'MemberExpression')

        json.left.property = ridAllLocals(json.left.property,locals);

    return json;
}

export function rowIfStatement(code, locals){
    let copy = Object.assign({}, locals);
    code.test = ridAllLocals(code.test,locals);
    code.consequent = ridAllLocals(code.consequent,copy);

    //if(code.alternate)
    code.alternate = ridAllLocals(code.alternate,locals);

    return code;
}

export function rowUnaryExpression(json, locals){
    let arg=json.argument;

    //if(arg) {
    json.argument = ridAllLocals(arg, locals);
    //}
    return json;
}

export function reqBinaryExpression(json){
    if(json.left.type === 'Literal' && json.right.type === 'Literal')
        return {'type': 'Literal', 'value': eval(json.left.raw + ' ' + json.operator + ' ' + json.right.raw), 'raw': eval(json.left.raw + ' ' + json.operator + ' ' + json.right.raw).toString()};
    if(json.right.type == 'BinaryExpression') {
        json.right = reqBinaryExpression(json.right);
    }
    if(json.left.type === 'BinaryExpression') {
        json.left = reqBinaryExpression(json.left);
    }

    return json;
}

