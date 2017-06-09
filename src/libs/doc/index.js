import { isAbsolute, resolve, join, relative } from 'path'
import { getPaths, getApiInfo, promisify } from './utils'

import marked from './marked'
import { writeFile } from 'fs'


export async function getContent(apiDir) {
    let paths = await getPaths(apiDir)
    let contents = []

    for (let path of paths) {
        let apis = await getApiInfo(path)
        contents.push(`## ${relative(process.cwd(), path)}\n`)
        for (let api of apis) {
            contents.push(marked(api))
        }
    }
    return contents.join('\n')
}

export async function writeContent(docPath, content) {
    return await promisify(writeFile)(getPath(docPath), content, { encoding: 'utf8', flag: 'w' })
}

function getPath(path) {
    return isAbsolute(path) ? path : resolve(join(process.cwd(), path))
}



