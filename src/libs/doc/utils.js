import { parse } from 'babylon'
import glob from 'glob'
import { readFile } from 'fs'

export async function getPaths(src) {
    return await promisify(glob)(`${src}/**/*.js`, { realpath: true })
}

export async function getApiInfo(path) {
    let content = await getContent(path)
    return getDecoratorsInfo(getDecorators(parseCodeToAst(content)))
}

export function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            return fn.apply(fn, [...args, (err, res) => {
                if(err) {
                    reject(err)
                    return
                }
                resolve(res)
            }])
        })
    }
}

async function getContent(path) {
    return await promisify(readFile)(path, 'utf-8')
}


function getDecorators(ast) {
    let type = ast.find(node => node.declaration && node.declaration.type === 'ClassDeclaration')
    return type.declaration.body.body.filter(ex => ex.type === 'ClassMethod' && Array.isArray(ex.decorators))
}

function getDecoratorsInfo(decorators) {
    return decorators.map(dec => extractDecorator(dec))
}

function extractDecorator(dec) {
    let result = {
        params: []
    }

    dec.decorators.filter(d => d.type === 'Decorator').map(d => {
        let comment = getComment(d)
        if (comment) {
            result.comment = comment
        }
        switch (getDecoratorName(d)) {
            case 'RequestUrl':
                [result.url, result.method] = getArgs(d)
                result.comment = getComment(d)
                break
            case 'RequestParam':
                result.params.push(getArgs(d))
                break
            default:
            // noting
        }
    })

    return result
}

function getComment(dec) {
    let v
    if (dec.leadingComments) {
        v = dec.leadingComments.find(comment => ['CommentLine', 'CommentBlock'].includes(comment.type))
        v = v.value
    } else {
        v = ''
    }
    return v
}

function getArgs(dec) {
    return dec.expression.arguments.reduce((pre, cur) => {
        if (cur.type === 'StringLiteral') {
            pre.push(cur.value)
        } else if (cur.object && cur.property) {
            pre.push(`${cur.property.name}`)
        }
        return pre
    }, [])
}

function getDecoratorName(dec) {
    return dec.expression.callee.name
}

function parseCodeToAst(code) {
    return parse(code.toString(), {
        sourceType: 'module',
        plugins: [
            'doExpressions',
            'objectRestSpread',
            'classProperties',
            'exportExtensions',
            'functionBind',
            'functionSent',
            'dynamicImport',
            'decorators',
            'asyncGenerators'
        ]
    }).program.body
}

