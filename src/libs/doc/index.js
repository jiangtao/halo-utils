import marked from './marked'
import { writeFile } from 'fs'
import { getPaths, getApiInfo, promisify } from './utils'
import { isAbsolute, resolve, join, relative } from 'path'

export async function getContent(dir) {
    let paths, contents

    paths = await getPaths(dir)
    contents = []

    for (let path of paths) {
        let apis = await getApiInfo(path)
        contents.push(`## ${relative(process.cwd(), path)}\n`)
        for (let api of apis) {
            contents.push(marked(api))
        }
    }
    
    return contents.join('\n')
}

export async function writeContent(path, content) {
    return await promisify(writeFile)(toAbsolutePath(path), content, { encoding: 'utf8', flag: 'w' })
}

function toAbsolutePath(path) {
    return isAbsolute(path) ? path : resolve(join(process.cwd(), path))
}