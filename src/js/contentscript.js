/*
 * TransIt ContentScript
 */

import $ from 'jquery';
import app from './config/application';
import notify from './lib/notify';
import { getSelection } from './lib/utils';

let capslockEvents = [];

function isInFrameset() {
  return !!window.top.document.querySelector('frameset');
}

// Ctrl + Shift + L
function isLinkInspectKeymap(evt) {
  return evt.ctrlKey && evt.shiftKey && evt.which == 12;
}

function shortcutHandler(evt) {
  if (app.options.linkInspect && isLinkInspectKeymap(evt)) {
    toggleLinkInspectMode();
  }
}

function toggleLinkInspectMode(flag) {
  $('body').toggleClass('translt-link-inspect-mode', flag);
  const enabled = $('body').is('.translt-link-inspect-mode');
  chrome.runtime.sendMessage({ type: 'linkInspect', enabled: enabled });
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
  $(document).on('keypress', shortcutHandler);
  $(document).on('mouseup', selectionHandler);
});