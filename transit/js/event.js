var API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='
var PUSH_URL = 'http://trit.herokuapp.com/api/items'
var currentText = null;

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
    currentText = request.text;
    if (request.from == 'page' && crx.options.get('page_selection_enabled') === false) return;

    console.log('Translating text:', request.text);
    // 如果翻译已经缓存起来了，则直接取缓存中的结果，不再向服务器发请求
    // TODO 优化代码结构，消除重复代码，简化逻辑 @greatghoul
    // TODO 为翻译缓存提供简单统计 @greatghoul
    var title = request.from == 'page' ? fmt(TPLS.TITLE, request.text) : ''; 
    var translation = localStorage['transit_' + request.text];
    if (translation) {
        // TODO 使用 CRXKIT 将配置信息在扩展各页面间同步
        sendResponse({ translation: fmt(TPLS.SUCCESS, fmt('%{1}%{2}', title, translation)), settings: settings() });
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;

            var result = JSON.parse(this.responseText);
            console.log('==>', result);

            if (!result || result.errorCode) return;

            translation = getTranslation(result);
            if (translation) {
                sendResponse({ translation: fmt(TPLS.SUCCESS, fmt('%{1}%{2}', title, translation)), settings: settings() });
                localStorage['transit_' + request.text] = translation;
                pushItem.delay(100, request.text, translation);
            } else {
                sendResponse({ translation: fmt(TPLS.WARNING, fmt('%{1}未找到释义', title)), settings: settings() });
            }
        };
        xhr.open('GET', API_URL + encodeURIComponent(request.text), true);
        xhr.send();
    }
}

var dispatcher = {
    translate: translateHanlder
};

// 响应来自页面和弹出层的翻译请求
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var handler = dispatcher[request.type] || noop;
    handler(request, sender, sendResponse);

    return true;
});

initOptions({
    notifyTimeout: 5,   // 页面划词结果显示时间
    pageInspect: true,  // 是否启用页面划词
    pushItem: false     // 是否推送单词到服务端
}); 
