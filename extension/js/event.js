var API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='
var PUSH_URL = 'http://trit.herokuapp.com/api/items'
var currentText = null;

// 推送词条到服务器
// TODO: 实现用户登录功能，将词条推送到自己的账户下
function pushItem(name, explaination) {
    var params = Object.toQueryString({
        name: name,
        explaination: explaination
    });

    log("  Pushing translation to server:", params);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', PUSH_URL, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "close");
    xhr.send(params);
}


// 执行翻译动作
function translateHanlder(request, sender, sendResponse) {
    // 如果翻译已经缓存起来了，则直接取缓存中的结果，不再向服务器发请求
    // TODO 优化代码结构，消除重复代码，简化逻辑 @greatghoul
    // TODO 为翻译缓存提供简单统计 @greatghoul
    var title = request.from == 'page' ? fmt(TPLS.TITLE, request.text) : ''; 
    currentText = request.text;

    log('Translating', request.text, 'from youdao')
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        var result = JSON.parse(this.responseText);
        log('Result:', result, JSON.stringify(result));

        if (!result || result.errorCode) return;

        translation = getTranslation(result);

        if (translation) {
            sendResponse({ 
                translation: fmt(TPLS.SUCCESS, title + translation) 
            });

            // 向服务器推送翻译结果
            // 暂时屏蔽掉推送的功能
            // if (options.pushItem) {
            //     pushItem.delay(100, request.text, translation);
            // }
        } else {
            sendResponse({
                translation: fmt(TPLS.WARNING, title + '未找到释义')
            });
        }
    };
    xhr.open('GET', API_URL + encodeURIComponent(request.text), true);
    xhr.send();
}

function selectionHandler(request, sender, sendResponse) {
    currentText = request.text;
    talkToPage(null, request);
}

registerMessageDispatcher({
    translate: translateHanlder,
    selection: selectionHandler
});

// Cleanup scripts for release 1.2
// Will be removed in next release.
function clearCacheStuff(details) {
    if (details.reason == 'update') {
        localStorage.clear();
        log('Cache cleaned up')
    };
}

initOptions(function() {
    chrome.runtime.onInstalled.addListener(clearCacheStuff);
}); 
