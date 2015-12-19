var app = require('../lib/crxkit');

app.setup({
  name: 'transit',
  options: {
    notifyTimeout: 5,     // 页面划词结果显示时间
    pageInspect: true,    // 是否启用页面划词
    linkInspect: true,    // 是否启用链接划词
    pushItem: false,      // 是否推送单词到服务端,
    notifyMode: 'margin', // 结果默认显示在右上角
    translator: 'baidu',  // 默认的翻译服务
  }
});

app.showUpdateNotes = function() {
  chrome.notifications.create("update_notes", {
      type: "list",
      title: "TransIt V1.4 更新记录",
      message: "",
      iconUrl: "img/icon48.png",
      items: [
        {
          title: '新增',
          message: '页面划词翻译的面板可以手动关闭'
        }
      ]
  }, function () {});
};

module.exports = app;
