var app = require('../lib/crxkit');

app.setup({
  name: 'transit',
  options: {
    notifyTimeout: 5,     // 页面划词结果显示时间
    pageInspect: true,    // 是否启用页面划词
    linkInspect: true,    // 是否启用链接划词
    pushItem: false,      // 是否推送单词到服务端,
    notifyMode: 'margin', // 结果默认显示在右上角
    translator: 'youdao', // 默认的翻译服务
  }
});

app.showUpdateNotes = function() {
  chrome.notifications.create("update_notes", {
      type: "list",
      title: "TransIt V1.5.4 更新记录",
      message: "",
      iconUrl: "img/icon48.png",
      items: [
        {
          title: '',
          message: '解决链接划词模式劫持全局快捷键导致页面链接点击异常的问题'
        },
        {
          title: '',
          message: '链接划词的快捷键更新为 Ctrl+Shift+L'
        }
      ]
  }, function () {});
};

module.exports = app;
