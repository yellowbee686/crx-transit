/**
 * Chrome Extension Utilities
 *
 * jshint strict: true
 */

var _ = require('underscore');

function noop() {}

function registerMessageDispatcher(dispatcher) {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      var handler = dispatcher[request.type] || noop;
      handler(request, sender, sendResponse);

      return true;
    }
  );
}

function talkToPage(tabId, message, callback) {
  if (tabId) {
    chrome.tabs.sendMessage(tabId, message, callback);  
  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      talkToPage(tabs[0].id, message, callback);
    });
  }
}

/*
 * 从 storage 中读取配置，如果没有配置，则初始化为默认值
 *
 * @params {function} callback - Callback after options loaded.
 */
function initOptions(callback) {
  chrome.storage.sync.get(null, function(data) {
    $.extend(options, data);
    chrome.storage.sync.set(options);
    callback();
  });
}

function log() {
  var message = Array.prototype.slice.call(arguments, 0);
  console.log.apply(console, ['[transit]'].concat(message));
}

module.export = {
  registerMessageDispatcher: registerMessageDispatcher,
  talkToPage: talkToPage,
};