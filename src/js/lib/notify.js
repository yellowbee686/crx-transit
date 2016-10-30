import $ from 'jquery';
import sugar from 'sugar';
import {
  stopPropagation,
  clearSelection,
  renderTranslation
} from './utils';

var notifyList = [];
var tpls = {
  notify: '<div class="transit-notify transit-{1}">' +
          ' <a href="javascript:;" class="transit-notify-close">&times;</a>' +
          ' <div class="transit-notify-content">{2}</div>' +
          '</div>',
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

function clearNotifyList() {
  for(var i=0;i<notifyList.length;i++){
    notifyList[i].close();
  }
}

var Notify = function(text, options) {
  //如果是替代模式，立即销毁上一个
  var self = this;
  if(options.replaceMode=='replace'){
    clearNotifyList();
  }

  this.text = text;
  this.options = options;

  this.render();
  this.request();
};

// Render the notify onto the page.
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

// Request for translation.
Notify.prototype.request = function() {
  var self = this;
  var message = { type: 'translate', text: self.text };
  chrome.extension.sendMessage(message, function(response) {
    var result = renderTranslation(self.text, response);
    self.$el.find('.transit-notify-content').html(result);
    self.bind();
    self.hide();
  });
};

// Mouse over to stop the auto hide timeout.
Notify.prototype.mouseover = function() {
  var $notify = this.$el;
  $notify.clearQueue();
  $notify.stop();

  if ($notify.is('.transit-in-place')) {
    $notify.insertAfter($('.transit-in-place:last'));
    event.stopPropagation();
  }
};

// Setup event binding
Notify.prototype.bind = function() {
  //鼠标划入时调用mouseover 划出时调用hide
  this.$el.hover(
    $.proxy(this.mouseover, this),
    $.proxy(this.hide, this)
  );

  var $close = this.$el.find('.transit-notify-close');
  $close.click($.proxy(this.close, this));

  // Prevent trigger transit event.
  $close.mouseup(stopPropagation);
};

// Hide the notify after configured seconds.
Notify.prototype.hide = function() {
  //如果替代模式是队列，则一个个按时间销毁
  if(this.options.replaceMode=='queue'){
    this.$el.delay(this.options.timeout * 1000)
          .fadeOut($.proxy(this.destroy, this));
  }
};

// Close the notify immediately
Notify.prototype.close = function(event) {
  clearSelection();
  this.$el.fadeOut($.proxy(this.destroy, this));
};

// Destroy the notify and remove it from the page.
Notify.prototype.destroy = function() {
  notifyList.remove({ text: this.text });
  if(this.$el && this.$el.remove){
    this.$el.remove();
  }
};

const notify = function(text, options) {
  // 相同的搜索存在时不会再加入
  if (!notifyList.find({ text: text })) {
    notifyList.push(new Notify(text, options));
  }
};

window.notify = notify;
export default notify;