/**
 * Chrome Extension Utilities
 *
 * jshint strict: true
 */

import sugar from 'sugar';

let options = {};
let name = 'crxkit';

function noop() {}

function registerMessageDispatcher(dispatcher) {
  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      const handler = dispatcher[message.type] || noop;
      handler(message, sender, sendResponse);

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
      chrome.tabs.update(optionTab.id, { highlighted: true });
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

    chrome.storage.onChanged.addListener(function(changes) {
      for (var name in changes) {
        var change = changes[name];
        options[name] = change.newValue;
      }
    });

    if (Object.isFunction(callback)) {
      callback();
    }
  });
}

function log() {
  var message = Array.prototype.slice.call(arguments, 0);
  var pefix = '[{1}]'.assign(name);
  console.log.apply(console, [pefix].concat(message));
}

function setup(settings) {
  Object.merge(options, settings.options);
  name = settings.name;
}

module.exports = {
  initOptions: initOptions,
  registerMessageDispatcher: registerMessageDispatcher,
  openExtensionPage: openExtensionPage,
  talkToPage: talkToPage,
  options: options,
  setup: setup,
  log: log,
};