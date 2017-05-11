import test from 'ava'
import { generateRouterMaps } from '../src'

test('generateRouterMaps', (t) => {
    t.deepEqual(generateRouterMaps({
        dir: './tests/router'
    }).map((item) => ({ url: item.url, method: item.method, middleware: item.middleware })), [{
        url: '/test',
        method: 'get',
        middleware: 'deep.index.action'
    }, {
        url: '/test',
        method: 'get',
        middleware: 'index.action'
    }])
})

test('generateRouterMaps, dir is not directory', (t) => {
    t.deepEqual(generateRouterMaps({ dir: './tests/router/test.js' }), [])
})

test('generateRouterMaps, dir not exist', (t) => {
    t.deepEqual(generateRouterMaps({ dir: './tests/router/undef' }), [])
})

test('generateRouterMaps, dir exist, but empty directory', (t) => {
    t.deepEqual(generateRouterMaps({ dir: './tests/router/null' }), [])
})