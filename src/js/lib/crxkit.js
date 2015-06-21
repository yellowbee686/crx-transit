/**
 * Chrome Extension Utilities
 *
 * jshint strict: true
 */

var options = {};

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

function openExtensionPage(filename) {
  var optionsUrl = chrome.extension.getURL(filename);

  chrome.tabs.query({}, function(tabs) {
    var optionTab = tabs.find({ url: optionsUrl });

    if (optionTab) {
      chrome.tabs.reload(optionTab.id);
      chrome.tabs.reload(optionTab.id, { highlighted: true });
    } else {
      chrome.tabs.create({ url: optionsUrl });
    }
  });
}

/*
 * 从 storage 中读取配置，如果没有配置，则初始化为默认值
 *
 * @params {function} callback - Callback after options loaded.
 */
function initOptions(callback) {
  chrome.storage.sync.get(null, function(data) {
    Object.merge(options, data);
    chrome.storage.sync.set(options);
    callback();
  });
}

function log() {
  var message = Array.prototype.slice.call(arguments, 0);
  console.log.apply(console, ['[transit]'].concat(message));
}

module.exports = {
  initOptions: initOptions,
  registerMessageDispatcher: registerMessageDispatcher,
  talkToPage: talkToPage,
  options: options,
};