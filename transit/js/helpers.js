// TransIt 通用函数

// 去掉字符串首尾空格
function strip(s) {
    return (s || '').replace(/(^\s+|\s+$)/g, '');
}

// 从查询结果中提取出翻译结果
function getTranslation(result) {
    var translation = null; 
    if (result.basic) {
        translation = result.basic.explains.join('<br/>');
    } else if (result.translation) {
        translation = result.translation.join('<br />');
    }
    
    if (translation != result.query) {
        return translation;
    } else {
        return '<div class="transit-error">未查询到释义</div>';
    }
}

