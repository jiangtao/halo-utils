let fs = require('fs')
let path = require('path')
let babylon = require('babylon')

export default function (options) {
    let result = []

    options = Object.assign({}, {
        files: []
    }, options)

    if (!options.files.length) {        
        return result
    }

    for (let file of options.files) {
        result = [...result, ...getRouterInfos(file, parseCodeToAst(fs.readFileSync(file)))]
    }

    return result
}

function getRouterInfos(file, ast) {
    let result = []

    for (let node of ast) {
        if (node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration') {
            for (let item of node.declaration.body.body) {
                if (item.decorators && item.async) {
                    result.push(getRouterInfo(file, item))
                }
            }
        }
    }

    return result.filter((item) => Object.keys(item).length)
}

function getRouterInfo(file, node) {
    let action, fileInfo, filePath, fileName, url, method

    action = node.key.name
    fileInfo = path.parse(file)
    filePath = fileInfo.dir
    fileName = fileInfo.name

    for (let item of node.decorators) {
        if (item.expression.type === 'CallExpression' && item.expression.callee.name === 'RequestUrl') {
            [url, method] = item.expression.arguments

            url = url.value
            method = method ? method.property.name.toLowerCase() : 'get'
        }
    }

    return url && method ? {
        url,
        action,
        method,
        filePath,
        fileName
    } : {}
}

function parseCodeToAst(code) {
    return babylon.parse(code.toString(), {
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