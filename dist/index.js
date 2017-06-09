'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.doc = exports.generateRouterMaps = exports.rule = undefined;

var _rule = require('./libs/rule');

var _rule2 = _interopRequireDefault(_rule);

var _router = require('./libs/router');

var _router2 = _interopRequireDefault(_router);

var _doc = require('./libs/doc');

var doc = _interopRequireWildcard(_doc);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.rule = _rule2.default;
exports.generateRouterMaps = _router2.default;
exports.doc = doc;