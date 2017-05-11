'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options) {
    options = Object.assign({}, {
        dir: ''
    }, options);

    options.dir = toAbsolutePath(options.dir);

    try {
        if (!(0, _fs.lstatSync)(options.dir).isDirectory()) {
            return [];
        }
    } catch (e) {
        return [];
    }

    return (0, _parse2.default)({
        files: getFiles(options.dir)
    }).map(item => {
        let dirPath = adjustPath(item.filePath).replace(adjustPath(options.dir), '');

        if (dirPath) {
            dirPath = dirPath.split(_path.sep).join('.') + '.';
            dirPath = dirPath.replace(/\.\./ig, '.');
        }

        return {
            url: item.url,
            method: item.method,
            filePath: (0, _path.join)(item.filePath, `${item.fileName}.js`),
            middleware: `${dirPath}${item.fileName}.${item.action}`
        };
    });
};

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFiles(dir, ext = '.js') {
    let result = [];

    for (let item of (0, _fs.readdirSync)(dir)) {
        let path, stat;

        path = (0, _path.join)(dir, item);
        stat = (0, _fs.lstatSync)(path);

        if (stat.isFile() && (0, _path.extname)(path) === ext) {
            result.push(path);
        } else if (stat.isDirectory()) {
            result = [...result, ...getFiles(path)];
        }
    }

    return result;
}

function adjustPath(path) {
    return path.charAt(path.length - 1) === '/' ? path : `${path}/`;
}

function toAbsolutePath(path) {
    return (0, _path.isAbsolute)(path) ? path : (0, _path.resolve)((0, _path.join)(process.cwd(), path));
}