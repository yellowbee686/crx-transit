var options = {};

// TransIt 通用函数
var TPLS = {
    SUCCESS: '<div class="success">%{1}</div>',
    WARNING: '<div class="warning">%{1}</div>',
    TITLE: '<h6>%{1}</h6>'
};


// 从 storage 中读取配置，如果没有配置，则初始化为默认值
function initOptions(defaults) {
    var defaults = defaults || {};
    chrome.storage.sync.get(null, function(data) {
        // Storage 没有存储设置项，初始化为默认值
        if (Object.isEmpty(data)) {
            chrome.storage.sync.set(defaults, function() {
                options = defaults;
                console.log('Initialize options with defaults:', defaults);
            });
        } else {
            options = data;
        }

        console.log('Current options is:', options);
    });
}

// 监听设置项的变化
chrome.storage.onChanged.addListener(function(changes) {
    for (var name in changes) {
        var change = changes[name];
        console.log('Option {1} changed from {2} to {3}'.assign(name, change.oldValue, change.newValue));
        options[name] = change.newValue;
    }
});

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
