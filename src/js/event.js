var crxkit           = require('./lib/crxkit.js')
  , BaiduTranslator  = require('./translators/baidu_translator')
  , YoudaoTranslator = require('./translators/youdao_translator');

var currentText = '';
var TRANSLATORS = {
    baidu: BaiduTranslator,
    youdao: YoudaoTranslator
};

// 执行翻译动作
function translateHanlder(request, sender, sendResponse) {
    // 如果翻译已经缓存起来了，则直接取缓存中的结果，不再向服务器发请求
    // TODO 优化代码结构，消除重复代码，简化逻辑 @greatghoul
    // TODO 为翻译缓存提供简单统计 @greatghoul
    var title = request.from == 'page' ? fmt(TPLS.TITLE, request.text) : '';
    var service = TRANSLATORS[options.translator];
    currentText = request.text;

    // 如果词为空，则不再翻译
    if (!currentText) return;

    log('Translating', currentText, 'from', service.name);
    service.translate(currentText, function(result) {
        var translation = fmt(TPLS.WARNING, title + '未找到释义');

        if (result) {
            log('=>', result);
            translation = result.translation;
            if (result.phonetic) {
                var phonetic = fmt(TPLS.PHONETIC, result.phonetic);
                translation = phonetic + translation;
            }
            if (result.web) {
              var web = fmt(TPLS.WEB, result.web);
              translation = translation + web;
            }

            translation = fmt(TPLS.SUCCESS, title + translation); 
        } else {
            log('WARNING: translation not found.')
        }

        sendResponse({ translation: translation });
    });
}

function selectionHandler(request, sender, sendResponse) {
    currentText = request.text;
    talkToPage(null, request);
}

crxkit.registerMessageDispatcher({
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
