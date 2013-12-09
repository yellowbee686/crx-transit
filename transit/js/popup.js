$(function() {
    var app = chrome.extension.getBackgroundPage();
	var $source = $('#source');
    var $result = $('#result');
    var $toggle = $('#toggle');
    var $timeout = $('#timeout');

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
        console.log(this.checked);
        app.crx.options.set(this.name, this.checked);
    }

    // 更新提示信息保持时间
    function updateNotifyTimeout() {
        var timeout = this.value;
        $(this).next().html(timeout);
        app.crx.options.set(this.name, this.value);
    }

    // 事件注册
    $source.on('keypress', transit);
    $toggle.on('change', togglePageSelection);
    $timeout.on('change', updateNotifyTimeout);

    $toggle.prop('checked', app.crx.options.get($toggle.attr('name'))); 
    $timeout.get(0).value = parseInt(app.crx.options.get($timeout.attr('name')));
    $timeout.trigger('change');
    $source.focus();
    $source.val(app.currentText);
    translate(app.currentText);
});
