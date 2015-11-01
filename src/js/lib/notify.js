var $ = require('jquery');
var sugar = require('sugar');
var utils = require('./utils');

var notifyList = [];
var tpls = {
  notify: '<div class="transit-notify transit-{1}">{2}</div>',
  list: '<div class="transit-notify-list">' +
        '  <div class="transit-list-inner"></div>' +
        '</div>',
  success: '<div class="transit-result transit-success">{1}</div>',
  warning: '<div class="transit-result transit-warning">{1}</div>',
  loading: '<div class="transit-result transit-success">' +
           '正在翻译 <strong>{1} ...</strong></div>',
};

function getNotifyList() {
  var $notifyList = $('.transit-notify-list');
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
  this.$el = $(tpls.notify.assign(this.options.mode, loading));

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
  var self = this;
  var message = { type: 'translate', text: self.text };

  chrome.extension.sendMessage(message, function(response) {
    var result = utils.renderTranslation(self.text, response);
    self.$el.html(result);
    self.bind();
    self.hide();
  });
};

Notify.prototype.mouseover = function() {
  var $notify = this.$el;
  $notify.clearQueue();
  $notify.stop();

  if ($notify.is('.transit-in-place')) {
    $notify.insertAfter($('.transit-in-place:last'));
    event.stopPropagation();
  }
};

Notify.prototype.bind = function() {
  this.$el.hover(
    $.proxy(this.mouseover, this),
    $.proxy(this.hide, this)
  );
};

Notify.prototype.hide = function() {
  this.$el.delay(this.options.timeout * 1000)
          .fadeOut($.proxy(this.destroy, this));
};

Notify.prototype.destroy = function() {
  notifyList.remove({ text: this.text });
  this.$el.remove();
};

module.exports = function(text, mode, handler) {
  if (!notifyList.find({ text: text })) {
    notifyList.push(new Notify(text, mode, handler));
  }
};