var BaiduTranslator = require('./translators/baidu_translator');
var YoudaoTranslator = require('./translators/youdao_translator');

API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='
PUSH_URL = 'http://trit.herokuapp.com/api/items'
currentText = ''
TRANSLATORS =
  baidu: BaiduTranslator
  youdao: YoudaoTranslator

# 推送词条到服务器
# TODO: 实现用户登录功能，将词条推送到自己的账户下
pushItem = (name, explaination) ->
  params = Object.toQueryString(
    name: name
    explaination: explaination
  )
  log "  Pushing translation to server:", params
  xhr = new XMLHttpRequest()
  xhr.open "POST", PUSH_URL, true
  xhr.setRequestHeader "Content-Type", "multipart/form-data"
  xhr.setRequestHeader "Content-length", params.length
  xhr.setRequestHeader "Connection", "close"
  xhr.send params

# 执行翻译动作
translateHanlder = (request, sender, sendResponse) ->
  
  # 如果翻译已经缓存起来了，则直接取缓存中的结果，不再向服务器发请求
  # TODO 优化代码结构，消除重复代码，简化逻辑 @greatghoul
  # TODO 为翻译缓存提供简单统计 @greatghoul
  title = (if request.from is "page" then fmt(TPLS.TITLE, request.text) else "")
  service = TRANSLATORS[options.translator]
  currentText = request.text
  
  # 如果词为空，则不再翻译
  return  unless currentText
  log "Translating", currentText, "from", service.name
  service.translate currentText, (result) ->
    translation = fmt(TPLS.WARNING, title + "未找到释义")
    if result
      log "=>", result
      translation = result.translation
      if result.phonetic
        phonetic = fmt(TPLS.PHONETIC, result.phonetic)
        translation = phonetic + translation
      if result.web
        web = fmt(TPLS.WEB, result.web)
        translation = translation + web
      translation = fmt(TPLS.SUCCESS, title + translation)
    else
      log "WARNING: translation not found."
    sendResponse translation: translation

selectionHandler = (request, sender, sendResponse) ->
  currentText = request.text
  talkToPage null, request

# Cleanup scripts for release 1.2
# Will be removed in next release.
clearCacheStuff = (details) ->
  if details.reason is "update"
    localStorage.clear()
    log "Cache cleaned up"
API_URL = "http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q="
PUSH_URL = "http://trit.herokuapp.com/api/items"
currentText = ""
TRANSLATORS =
  baidu: BaiduTranslator
  youdao: YoudaoTranslator

registerMessageDispatcher
  translate: translateHanlder
  selection: selectionHandler

initOptions ->
  chrome.runtime.onInstalled.addListener clearCacheStuff