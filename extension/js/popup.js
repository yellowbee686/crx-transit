$(function() {
    var app = chrome.extension.getBackgroundPage(),
        $source = $('#source'),
        $result = $('#result');

    function translate(text) {
        if (!text) return;

        chrome.extension.sendMessage({ type: 'translate', text: text }, function(response) {
            $result.html(response.translation);
        });
    }

    // 查询单词
    function transit(evt) {
        var text = $source.val().trim();

        if (evt.keyCode != 13) return;

        translate(text);

        return false;
    }

    function setOption() {
        var $option = $(this),
            name = $option.attr('id'),
            option = {};

        if ($option.is('[type=checkbox]')) {
            option[name] = $option.prop('checked');
        } else {
            var value = $option.val();
            if ($option.is('[type=range]')) {
                option[name] = parseInt(value);
            } else {
                option[name] = value;
            }
        }

        chrome.storage.sync.set(option);    
    }

    // 更新提示信息保持时间
    function updateNotifyTimeout() {
        var timeout = this.value;
        $(this).next().html(timeout);
    }


    initOptions(function() {
        // 事件注册
        $source.on('keypress', transit);
        $('.option').on('change', setOption);
        $('#notifyTimeout').on('change', updateNotifyTimeout);

        // 读取配置项
        for (var name in options) {
            var $option = $('#' + name),
                value = options[name]; 

            if ($option.size() == 0) continue;
            
            if ($option.is('[type=checkbox]')) {
                $option.prop('checked', value);
            } else {
                $option.val(value);
            }
        }

        $('#notifyTimeout').trigger('change');

        $source.focus();
        $source.val(app.currentText);
        translate(app.currentText);
    });

});
