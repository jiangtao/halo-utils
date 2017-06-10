import test from 'ava'
import { resolve, join } from 'path'
import { rule, generateRouterMaps, doc } from '../src'
import { existsSync, unlinkSync, readFileSync } from 'fs'

test('generateRouterMaps', (t) => {
    t.deepEqual(generateRouterMaps({
        dir: './tests/router'
    }).map((item) => ({ url: item.url, method: item.method, middleware: item.middleware })), [{
        url: '/test',
        method: 'get',
        middleware: 'deep.index.action'
    }, {
        method: "post",
        middleware: "doc.index.getBooks",
        url: "/api/books",
    }, {
        method: "get",
        middleware: "doc.index.getBookInfo",
        url: "/api/book/:id",
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

test('required rule', (t) => {
    t.is(rule.getRule('required').exec(0), true)
    t.is(rule.getRule('required').exec(1), true)
    t.is(rule.getRule('required').exec('a'), true)
    t.is(rule.getRule('required').exec(''), false)
    t.is(rule.getRule('required').exec(' '), false)
    t.is(rule.getRule('required').exec(false), true)
    t.is(rule.getRule('required').exec(true), true)
    t.is(rule.getRule('required').exec([]), true)
    t.is(rule.getRule('required').exec({}), true)
    t.is(rule.getRule('required').exec(null), false)
    t.is(rule.getRule('required').exec(undefined), false)
    t.is(rule.getRule('required').exec(new Date()), true)
})

test('mobile rule', (t) => {
    t.is(rule.getRule('mobile').exec('18500000000'), true)
    t.is(rule.getRule('mobile').exec('1850000000'), false)
    t.is(rule.getRule('mobile').exec('185000000a0'), false)
})

test('min rule', (t) => {
    t.is(rule.getRule('min').exec(10, 8), true)
    t.is(rule.getRule('min').exec(10, 11), false)
})

test('max rule', (t) => {
    t.is(rule.getRule('max').exec(10, 8), false)
    t.is(rule.getRule('max').exec(10, 11), true)
})

test('email rule', (t) => {
    t.is(rule.getRule('email').exec('abc@@google.com'), false)
    t.is(rule.getRule('email').exec('abc@google.com'), true)
})

test('url rule', (t) => {
    t.is(rule.getRule('url').exec('www.gogole.com'), false)
    t.is(rule.getRule('url').exec('https://www.google.com'), true)
    t.is(rule.getRule('url').exec('http://google.com'), true)
})

test('minlength rule', (t) => {
    t.is(rule.getRule('minlength').exec('abc', 4), false)
    t.is(rule.getRule('minlength').exec('abcd', 4), true)
    t.is(rule.getRule('minlength').exec('abcde', 4), true)
})

test('maxlength rule', (t) => {
    t.is(rule.getRule('maxlength').exec('abc', 4), true)
    t.is(rule.getRule('maxlength').exec('abcd', 4), true)
    t.is(rule.getRule('maxlength').exec('abcde', 4), false)
})

test('date rule', (t) => {
    t.is(rule.getRule('date').exec('2017-1-1'), true)
    t.is(rule.getRule('date').exec('2017年1月1日'), true)
    t.is(rule.getRule('date').exec('2017-1-1-1'), false)
})

test('date rule', (t) => {
    t.is(rule.getRule('date').exec('2017-1-1'), true)
    t.is(rule.getRule('date').exec('2017年1月1日'), true)
    t.is(rule.getRule('date').exec('2017-1-1-1'), false)
})

test('number rule', (t) => {
    t.is(rule.getRule('number').exec('7826378'), true)
    t.is(rule.getRule('number').exec('213abc2313'), false)
})

test('repeat rule', (t) => {
    let error = t.throws(() => rule.addRule('number', function () { }, ''))

    t.is(error.message, 'Rule already exists')
})

test('repeat rule, silent options', (t) => {
    rule.addRule('number', (val, rule) => val === 'abc', '', true)

    t.is(rule.getRule('number').exec('abc'), true)
    t.is(rule.getRule('number').exec('ab'), false)
})

test('doc, get doc content', async function (t) {
    let content = await doc.getContent('./tests/router/doc')
    t.is(content.indexOf('/api/books') > -1, true)
    t.is(content.indexOf('POST') > -1, true)
    t.is(content.indexOf('required') > -1, true)
})

test('doc, write doc content', async function (t) {
    let content, apiDoc

    apiDoc = './api.md'
    content = await doc.getContent('./tests/router/doc')

    await doc.writeContent(apiDoc, content)
    apiDoc = resolve(join(process.cwd(), apiDoc))
    
    t.is(existsSync(apiDoc), true)
    t.is(readFileSync(apiDoc).indexOf('/api/books') > -1, true)
    readFileSync(apiDoc)
    unlinkSync(apiDoc)
})