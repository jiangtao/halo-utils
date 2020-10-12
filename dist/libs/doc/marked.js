'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function marked(api) {
    return `### 接口地址: ${api.url}
    
请求类型: ${api.method}

说明:${api.comment ? api.comment : '无'}

请求参数：
${getParams(api.params)}
`;
}

function getParams(params) {
    let combination = [];
    let rules = { '*': '' };

    if (params.length == 0) {
        return '无';
    } else {
        combination.push('参数 | 规则 | 描述');
        combination.push('---- | --- | ---');
        combination = combination.concat(params.map(param => `${param[0]} | ${param[1] in rules ? rules[param[1]] : param[1]} | ${param[2]}`));
        return combination.join('\n');
    }
}

exports.default = marked;