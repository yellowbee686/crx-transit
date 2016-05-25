/*
 * TransIt ContentScript
 * 
 * jshint strict: true
 */

var $ = require('jquery');
var app = require('./config/application');
import notify from './lib/notify';
import getSelection from './lib/selection';

var capslockEvents = [];

function toggleLinkInspectMode(evt) {
  if (app.options.linkInspect && evt.keyCode == 20) {
    capslockEvents.push(evt.keyCode);

    if (capslockEvents.length == 1) {
      var timer = setTimeout(function() {
        capslockEvents = [];
        clearTimeout(timer);
      }, 500);
    } else {
      $('body').toggleClass('translt-link-inspect-mode');
      capslockEvents = [];
    }
  }
}

function transIt(evt) {
  $('body').removeClass('translt-link-inspect-mode');

  const selection = getSelection(evt);
  
  if (selection) {
    const message = {
      type: 'selection',
      selection: selection
    };

    chrome.runtime.sendMessage(message, () => {
      notify(message.text, {
        mode: 'in-place',
        position: message.position,
        timeout: app.options.notifyTimeout,
      });
    });
  }
}

function selectionlateHandler(request) {
  notify(request.selection.text, {
    mode: 'margin',
    timeout: app.options.notifyTimeout,
  });
}

app.initOptions(function(options) {
  $(document).on('keyup keydown', toggleLinkInspectMode);
  $(document).on('mouseup', transIt);

  // 仅在顶层页面接受 margin 显示结果
  if (window == top) {
    app.registerMessageDispatcher({
      selection: selectionlateHandler
    });
  }
});