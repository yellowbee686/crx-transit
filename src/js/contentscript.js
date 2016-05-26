/*
 * TransIt ContentScript
 * 
 * jshint strict: true
 */

import $ from 'jquery';
import app from './config/application';
import notify from './lib/notify';
import getSelection from './lib/selection';

let capslockEvents = [];

function isInFrameset() {
  return !!window.top.document.querySelector('frameset');
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
      $('body').toggleClass('translt-link-inspect-mode');
      capslockEvents = [];
    }
  }
}

function toggleLinkInspectMode(flag) {
  $('body').toggleClass('translt-link-inspect-mode', flag);
}

// Inspect translation works only on word
function canTranslate(text) {
  return /^[a-z]+(\'|\'s)?$/i.test(text);
}

function selectionHandler(evt) {
  toggleLinkInspectMode(false);

  const selection = getSelection(evt);

  if (selection) {
    chrome.runtime.sendMessage({ type: 'selection', text: selection.text });

    if (app.options.pageInspect && canTranslate(selection.text)) {
      if (app.options.notifyMode == 'in-place' || isInFrameset()) {
        notify(selection.text, {
          mode: 'in-place',
          position: selection.position,
          timeout: app.options.notifyTimeout
        });
      } else {
        top.notify(selection.text, {
          mode: 'margin',
          timeout: app.options.notifyTimeout
        });
      }
    }
  }
}

app.initOptions(function(options) {
  $(document).on('keyup keydown', toggleLinkInspectMode);
  $(document).on('mouseup', selectionHandler);

  // // 仅在顶层页面接受 margin 显示结果
  // if (window == top) {
  //   app.registerMessageDispatcher({
  //     marginNotify: marginNotifyHandler
  //   });
  // }
});