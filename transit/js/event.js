var API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='
var PUSH_URL = 'http://trit.herokuapp.com/api/items'

function settings(key, value) {
    if (value == undefined) {
        return JSON.parse(localStorage['settings_' + key] || null);
    } else {
        localStorage['settings_' + key] = JSON.stringify(value);
    }
}

// 推送词条到服务器
// TODO: 实现用户登录功能，将词条推送到自己的账户下
function pushItem(name, explaination) {
    var params = Object.toQueryString({ name: name, explaination: explaination});
    console.log("  Pushing translation to server:", params);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', PUSH_URL, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "close");
    xhr.send(params);
}


// 执行翻译动作
function translateHanlder(request, sender, sendResponse) {
    console.log('Translating text:', request.text);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        var result = JSON.parse(this.responseText);
        console.log('==>', result);
        
        if (!result || result.errorCode) return;

        var translation = getTranslation(result);

        if (translation) {
            sendResponse({ translation: translation });
            pushItem.delay(100, request.text, translation);
        } else {
            sendResponse({ translation: TPLS.WARNING.assign('未找到释义') });
        }
        
    };
    xhr.open('GET', API_URL + encodeURIComponent(request.text), true);
    xhr.send();
}

// 获取设置项
function settingsHandler(request, sender, sendResponse) {
    sendResponse(settings(request.key));
}

var dispatcher = {
    translate: translateHanlder,
    settings: settingsHandler
};

// 响应来自页面和弹出层的翻译请求
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var handler = dispatcher[request.type] || noop;
    handler(request, sender, sendResponse);

    return true;
});
