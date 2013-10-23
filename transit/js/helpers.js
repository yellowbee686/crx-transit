// TransIt 通用函数
var TPLS = {
    SUCCESS: '<div class="success">%{1}</div>',
    WARNING: '<div class="warning">%{1}</div>',
    TITLE: '<h6>%{1}</h6>'
};

// 去掉字符串首尾空格
function strip(s) {
    return (s || '').replace(/(^\s+|\s+$)/g, '');
}


// 从查询结果中提取出翻译结果
function getTranslation(result) {
    var translation = null;
    if (result && !result.errorCode) {
        if (result.basic) {
            translation = result.basic.explains.join('<br/>');
        } else if (result.translation) {
            translation = result.translation.join('<br />');
        }
        
        if (translation == result.query) {
            translation = null;
        }
    }

    return translation;
}


// 空方法，用来处理无效的回调
function noop() {}

// 格式化字符串
//
// 用法：
//
// var s1 = '%{1} and %{2}!';
// console.log('source: ' + s1);
// console.log('target: ' + fmt(s1, 'ask', 'learn'));
//
// var s2 = "%{name} is %{age} years old, his son's name is %{sons[0].name}";
// console.log('source: ' + s2);
// console.log('target: ' + fmt(s2, { name: 'Lao Ming', age: 32, sons: [{ name: 'Xiao Ming' }]}));
function fmt() {
    var args = arguments;
    return args[0].replace(/%\{(.*?)}/g, function(match, prop) {
        return function(obj, props) {
            var prop = /\d+/.test(props[0]) ? parseInt(props[0]) : props[0];
            if (props.length > 1) {
                return arguments.callee(obj[prop], props.slice(1));
            } else {
                return obj[prop];
            }
        }(typeof args[1] === 'object' ? args[1] : args, prop.split(/\.|\[|\]\[|\]\./));
    });
}
