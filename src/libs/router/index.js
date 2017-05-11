import parse from './parse'
import { lstatSync, readdirSync } from 'fs'
import { isAbsolute, resolve, join, extname, sep } from 'path'

export default function (options) {
    options = Object.assign({}, {
        dir: ''
    }, options)

    options.dir = toAbsolutePath(options.dir)

    try {
        if (!lstatSync(options.dir).isDirectory()) {
            return []
        }
    } catch (e) {
        return []
    }

    return parse({
        files: getFiles(options.dir)
    }).map((item) => {
        let dirPath = adjustPath(item.filePath).replace(adjustPath(options.dir), '')

        if (dirPath) {
            dirPath = dirPath.split(sep).join('.') + '.'
            dirPath = dirPath.replace(/\.\./ig, '.')
        }
        
        return {
            url: item.url,
            method: item.method,
            filePath: join(item.filePath, `${item.fileName}.js`),
            middleware: `${dirPath}${item.fileName}.${item.action}`
        }
    })
}

function getFiles(dir, ext = '.js') {
    let result = []

    for (let item of readdirSync(dir)) {
        let path, stat

        path = join(dir, item)
        stat = lstatSync(path)
        
        if (stat.isFile() && extname(path) === ext) {
            result.push(path)
        } else if (stat.isDirectory()) {
            result = [...result, ...getFiles(path)]
        }
    }

    return result
}

function adjustPath(path) {
    return path.charAt(path.length - 1) === '/' ? path : `${path}/`
}

function toAbsolutePath(path) {
    return isAbsolute(path) ? path : resolve(join(process.cwd(), path))
}