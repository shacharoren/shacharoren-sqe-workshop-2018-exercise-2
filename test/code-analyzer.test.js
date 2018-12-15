import assert from 'assert';
import {useEscodegen} from '../src/js/code-analyzer';
import {divideCode} from '../src/js/divideCode';
import {parseCode} from '../src/js/code-analyzer';
import {divideToArgs,FillArgs,argMap,colors,colorLines,processLine,bool} from '../src/js/subMyCode';
describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});
describe('The javascript parser', () => {
    it('delete local variable from code', () => {
        let json = json1();
        //$('#json').val(JSON.stringify(json, null, 2));
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + 5;\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '        return x + y + z + (0 + x + 5);\n' +
            '    } else {\n' +
            '        return x + y + z + (0 + z + 5);\n' +
            '    }\n' +
            '}'
        );
    });
});
describe('The javascript parser', () => {
    it('function with While expression', () => {
        let json = loadJson();
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function foo(x, y, z) {\n' +
            '    while (x + 1 < z) {\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' +
            '    }\n' +
            '    return z;\n' +
            '}'
        );
    });
});
describe('The javascript parser', () => {
    it('function with complex expression', () => {
        let json = loadJson2();
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function foo(x, y, z) {\n' +
            '    while (x - 1 < z) {\n' +
            '        z = (x - 1 + (x - 1 + y)) * 2;\n' +
            '    }\n' +
            '    return z;\n' +
            '}'
        );
    });
});
describe('The javascript parser', () => {
    it('function with member expression', () => {

        let json = parseCode('function f(x, y){\n' +
            'let num = 1;\n' +
            'array[y + num] = 8;\n' +
            'return array;\n' +
            '}');

        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function f(x, y) {\n' +
            '    array[y + 1] = 8;\n' +
            '    return array;\n' +
            '}'
        );
    });});
describe('The javascript parser', () => {
    it('function deep equal fill args', () => {
        let json = parseCode('function f(x,y,z){\n' +
            'let a=x;\n' +
            'return a;\n' +
            '}');
        let array = [1,2,3];
        FillArgs(json,array.map(String));
        var map = new Object(); // or var map = {};
        map['x'] = '1';
        map['y'] = '2';
        map['z'] = '3';

        //let str='{ x: \'1\', y: \'2\', z: \'3\' }'
        //let expected={x: "1", y: "2", z: "3"};
        //let finalCode = divideCode(json.body[0],{});
        //let fromCodeToString = useEscodegen(finalCode);
        assert.deepEqual(argMap,map);
    });
});
describe('The javascript parser', () => {
    it('function with array expression', () => {
        let json = parseCode('function foo(){\n' +
            'let array=[5,6,7];\n' +
            'return array[1];\n' +
            '}\n' +
            '\n');

        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function foo() {\n' +
            '    return 6;\n' +
            '}'
        );
    });
});
describe('The javascript parser', () => {

    it('function deep equal color lines', () => {
        let codeAfterChanges='function foo(x, y, z) {\n' +
            '    if (x + 1 < y) {\n' +
            '        return x;\n' +
            '    }\n' +
            '}';
        colorLines(codeAfterChanges);
        var map = new Object(); // or var map = {};
        map['1'] = 'red';
        assert.deepEqual(colors,map);
    });

});
describe('The javascript parser', () => {
    it('function with unary expression', () => {
        let json = parseCode('function foo(){\n' +
            'let a=-1; \n' +
            'return a;\n' +
            '}');
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'function foo() {\n' +
            '    return -1;\n' +
            '}'
        );
    });
});
describe('The javascript parser', () => {
    it('function deep equal color lines with one green one red', () => {
        let codeAfterChanges='function foo(x, y, z) {\n' +
            '    if (x + 1 < y) {\n' +
            '        return x;\n' +
            '    } else if (x + 1 < z * 2) {\n' +
            '        return y;\n' +
            '    }\n' +
            '}';
        //console.log("this is colors:" + colors);
        colorLines(codeAfterChanges);

        var map = new Object(); // or var map = {};
        map['1'] = 'red';
        map['3'] = 'green';
        assert.deepEqual(colors,map);
    });

});
describe('The javascript parser', () => {
    it('function else if', () => {
        let line='} else if (x + 1 + y < z * 2) {';
        let index= 3;
        let result=processLine(line,index);
        assert.equal(result,bool);
    });
});
describe('The javascript parser', () => {
    it('function deep equal color lines with two red', () => {
        let codeAfterChanges='function foo(x, y, z) {\n' +
            '    if (x + 1 < y) {\n' +
            '        return x;\n' +
            '    } else if (x + 1 > z * 2) {\n' +
            '        return y;\n' +
            '    }\n' +
            '}';
        colorLines(codeAfterChanges);
        var map = new Object(); // or var map = {};
        map['1'] = 'red';
        map['3'] = 'red';
        assert.deepEqual(colors,map);
    });
});
describe('The javascript parser', () => {
    it('function with green first then red', () => {
        let json = loadJson3();
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString, 'function foo(x, y, z) {\n' +
            '    if (x + 8 > z) {\n' +
            '        return x + y + z;\n' +
            '    } else if (x + 8 > z * 9) {\n' +
            '        return x + y;\n' +
            '    } else {\n' +
            '        return x;\n' +
            '    }\n' +
            '}');
    });
});
describe('The javascript parser', () => {
    it('check function process line enter first if', () => {
        let line='if (x + 8 > z) {';
        let index= 1;
        let result=processLine(line,index);
        assert.equal(result,bool);
    });
});


describe('The javascript parser', () => {
    it('code with global variable', () => {
        let json = parseCode('let global = 1;\n' +
            'function foo(){\n' +
            'let a=-1;\n' +
            'return a;\n' +
            '}');
        let finalCode = divideCode(json,{});
        let fromCodeToString = useEscodegen(finalCode);
        assert.equal(fromCodeToString,
            'let global = 1;\n' +
            'function foo() {\n' +
            '    return -1;\n' +
            '}'
        );
    });
});

describe('The javascript parser', () => {
    it('function deep equal fill args with global variables', () => {
        let json = parseCode('let global = 1;\n' +
            'function f(x,y,z){ \n' +
            'let a=x;\n' +
            'return a;\n' +
            '}');
        let array = [1,2,3];
        divideToArgs(json,array.map(String));
        var map = new Object(); // or var map = {};
        map['x'] = '1';
        map['y'] = '2';
        map['z'] = '3';

        assert.deepEqual(argMap,map);
    });
});




function json1(){
    let json=parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    if (b < z) {\n' +
        '        c = c + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else if (b < z * 2) {\n' +
        '        c = c + x + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '        return x + y + z + c;\n' +
        '    }\n' +
        '}\n');
    return json;
}
function loadJson(){
    let json = parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    while (a < z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}\n');
    return json;
}
function loadJson2(){
    let json = parseCode('function foo(x, y, z){\n' +
        '    let a = x - 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    while (a < z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}');
    return json;
}
function loadJson3(){
    let json = parseCode('function foo(x, y, z){\n' +
        '    let a = x + 8;\n' +
        '    if (a > z) {\n' +
        '        return x + y + z ;\n' +
        '    } else if (a > z * 9) {\n' +
        '        return x + y ;\n' +
        '    } else {\n' +
        '        return x;\n' +
        '    }\n' +
        '}');
    return json;
}