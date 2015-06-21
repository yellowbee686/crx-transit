/**
 * Chrome Extension Utilities
 *
 * jshint strict: true
 */

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

module.export = {
  registerMessageDispatcher: registerMessageDispatcher,
  talkToPage: talkToPage,
};