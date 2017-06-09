'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPaths = getPaths;
exports.getApiInfo = getApiInfo;

var _babylon = require('babylon');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getPaths(src) {
    return await (0, _util.promisify)(_glob2.default)(`${src}/**/*.js`, { realpath: true });
}

async function getApiInfo(path) {
    let content = await getContent(path);
    return getDecoratorsInfo(getDecorators(parseCodeToAst(content)));
}

async function getContent(path) {
    return await (0, _util.promisify)(_fs.readFile)(path, 'utf-8');
}

function getDecorators(ast) {
    let type = ast.find(node => node.declaration && node.declaration.type === 'ClassDeclaration');
    return type.declaration.body.body.filter(ex => ex.type === 'ClassMethod' && Array.isArray(ex.decorators));
}

function getDecoratorsInfo(decorators) {
    return decorators.map(dec => extractDecorator(dec));
}

function extractDecorator(dec) {
    let result = {
        params: []
    };

    dec.decorators.filter(d => d.type === 'Decorator').map(d => {
        let comment = getComment(d);
        if (comment) {
            result.comment = comment;
        }
        switch (getDecoratorName(d)) {
            case 'RequestUrl':
                [result.url, result.method] = getArgs(d);
                result.comment = getComment(d);
                break;
            case 'RequestParam':
                result.params.push(getArgs(d));
                break;
            default:
            // noting
        }
    });

    return result;
}

function getComment(dec) {
    let v;
    if (dec.leadingComments) {
        v = dec.leadingComments.find(comment => ['CommentLine', 'CommentBlock'].includes(comment.type));
        v = v.value;
    } else {
        v = '';
    }
    return v;
}

function getArgs(dec) {
    return dec.expression.arguments.reduce((pre, cur) => {
        if (cur.type === 'StringLiteral') {
            pre.push(cur.value);
        } else if (cur.object && cur.property) {
            pre.push(`${cur.property.name}`);
        }
        return pre;
    }, []);
}

function getDecoratorName(dec) {
    return dec.expression.callee.name;
}

function parseCodeToAst(code) {
    return (0, _babylon.parse)(code.toString(), {
        sourceType: 'module',
        plugins: ['doExpressions', 'objectRestSpread', 'classProperties', 'exportExtensions', 'functionBind', 'functionSent', 'dynamicImport', 'decorators', 'asyncGenerators']
    }).program.body;
}