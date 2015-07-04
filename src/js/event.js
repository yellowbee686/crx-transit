/*
 * TransIt Event
 * 
 * jshint strict: true
 */

var translators = require('./translators');
var app = require('./config/application');

window.currentText = '';

function getTranslator() {
  return translators[app.options.translator];
}

// 执行翻译动作
function translateHanlder(request, sender, sendResponse) {
  // 如果翻译已经缓存起来了，则直接取缓存中的结果，不再向服务器发请求
  // TODO 为翻译缓存提供简单统计 @greatghoul
  currentText = request.text;

  // 如果词为空，则不再翻译
  if (!currentText) return;

  // log('Translating', currentText, 'from', service.name);
  getTranslator().translate(currentText, sendResponse);
}

function selectionHandler(request, sender, sendResponse) {
  currentText = request.text;
  app.talkToPage(null, request);
}

app.registerMessageDispatcher({
  translate: translateHanlder,
  selection: selectionHandler
});

app.initOptions();
