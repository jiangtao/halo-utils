'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getContent = getContent;
exports.writeContent = writeContent;

var _marked = require('./marked');

var _marked2 = _interopRequireDefault(_marked);

var _fs = require('fs');

var _utils = require('./utils');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getContent(dir) {
    let paths, contents;

    paths = await (0, _utils.getPaths)(dir);
    contents = [];

    for (let path of paths) {
        let apis = await (0, _utils.getApiInfo)(path);
        contents.push(`## ${(0, _path.relative)(process.cwd(), path)}\n`);
        for (let api of apis) {
            contents.push((0, _marked2.default)(api));
        }
    }

    return contents.join('\n');
}

async function writeContent(path, content) {
    return await (0, _utils.promisify)(_fs.writeFile)(toAbsolutePath(path), content, { encoding: 'utf8', flag: 'w' });
}

function toAbsolutePath(path) {
    return (0, _path.isAbsolute)(path) ? path : (0, _path.resolve)((0, _path.join)(process.cwd(), path));
}