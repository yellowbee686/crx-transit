/*
 * TransIt ContentScript
 * 
 * jshint strict: true
 */

var $ = require('jquery');
var app = require('./config/application');
var notify = require('./lib/notify');

var capslockEvents = [];

function getPosition(evt, selection) {
  var rect = selection.getRangeAt(0).getBoundingClientRect();

  // 如果是在文本框中，这个坐标返回的会为 0，此时应该取鼠标位置
  if (rect.left === 0 && rect.top === 0) {
    rect = { left: evt.clientX, top: evt.clientY, height: 15 };
  }

  var left = rect.left + document.body.scrollLeft;
  var top  = rect.top + document.body.scrollTop;

  var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  if (clientHeight === 0) {
    clientHeight = document.documentElement.clientHeight;
  }
  if (rect.top >= 150) {
    var bottom = clientHeight - top;
    return { left: left, bottom: bottom };
  } else {
    return { left: left, top: top + rect.height + 5 };
  }
}

function toggleLinkInspectMode(evt) {
  if (app.options.linkInspect && evt.keyCode == 20) {
    capslockEvents.push(evt.keyCode);

    if (capslockEvents.length == 1) {
      var timer = setTimeout(function() {
        capslockEvents = [];
        clearTimeout(timer);
      }, 500);
    } else {
      $('body').toggleClass('transit-link-inspect-mode');
      capslockEvents = [];
    }
  }
}

function transIt(evt) {
  $('body').removeClass('transit-link-inspect-mode');

  var selection = window.getSelection();
  var text = $.trim(selection.toString());

  // 如果页面划词开启，并且选中的文本符合划词的 PATTERN 才进行翻译
  var message = {
    type: 'selection',
    mode: app.options.notifyMode,
    text: text
  };

  chrome.runtime.sendMessage(message, function() {
    if (message.mode == 'margin') return;

    notify(text, {
      mode: 'in-place',
      position: getPosition(evt, selection),
      timeout: app.options.notifyTimeout,
    });
  });
}

function selectionlateHandler(request) {
  notify(request.text, {
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