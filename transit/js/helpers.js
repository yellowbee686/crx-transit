// TransIt 通用函数

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
