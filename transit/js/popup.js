$(function() {
    var app = chrome.extension.getBackgroundPage();
	var $source = $('#source');
    var $result = $('#result');
    var $toggle = $('#toggle');

    function translate(text) {
        if (!text) return;

        chrome.extension.sendMessage({ type: 'translate', text: text }, function(response) {
            $result.html(response.translation);
        });
    }

    // 查询单词
    function transit(evt) {
        var text = $.trim($source.val());

        if (evt.keyCode != 13) return;

        translate(text);

        return false;
    }

    // 启用和禁用页面划词
    function togglePageSelection() {
        app.settings(this.name, this.checked);
    }

    // 事件注册
    $source.on('keypress', transit);
    $toggle.on('change', togglePageSelection);

    // 读取初始配置
    if (app.settings(toggle.name) == null) {
        app.settings(toggle.name, true);
    }

    $toggle.prop('checked', app.settings(toggle.name)); 
    $source.focus();
    $source.val(app.currentText);
    translate(app.currentText);
});
