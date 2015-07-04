var $ = require('jquery');
var sugar = require('sugar');
var utils = require('./utils');

var notifyList = [];
var tpls = {
  notify: '<div class="transit-notify">{1}</div>',
  list: '<div id="transit-notify-list">' +
        '  <div class="transit-list-inner"></div>' +
        '</div>',
  success: '<div class="transit-result transit-success">{1}</div>',
  warning: '<div class="transit-result transit-warning">{1}</div>',
  loading: '<div class="transit-result transit-success">' +
           '正在翻译 <strong>{1} ...</strong></div>',
};

function getNotifyList() {
  var $notifyList = $('#transit-notify-list');
  if ($notifyList.size() === 0) {
    $notifyList = $(tpls.list).appendTo('body');
  }

  return $notifyList;
}

var Notify = function(text, options) {
  this.text = text;
  this.options = options;

  this.render();
  this.request();
};

Notify.prototype.render = function() {
  var loading = tpls.loading.assign(this.text);
  this.$el = $(tpls.notify.assign(loading));

  if (this.options.mode == 'margin') {
    var $list = getNotifyList().find('.transit-list-inner');
    this.$el.appendTo($list);
  } else {
    this.$el.appendTo('body')
      .css({ position: 'absolute' })
      .css(this.options.position)
      .fadeIn();
  }
};

Notify.prototype.request = function() {
  var $notify = this.$el;
  var text    = this.text;
  var message = { type: 'translate', text: text }

  chrome.extension.sendMessage(message, function(response) {
    var result = utils.renderTranslation(text, response)
    $notify.html(result);
  });
};

module.exports = function(text, mode, handler) {
  if (!notifyList.find({ text: text })) {
    notifyList.push(new Notify(text, mode, handler));
  }
};