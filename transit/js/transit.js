// 页面划词简化，只允许划单词
var PAT_ENGLISH = /^[a-z]+(\'|\'s)?$/i;
var timer = null;
var $link = null;

// 通知效果
function notify(text, waitFor) {
    var $notify = $(this);

    if ($notify.is('.transit-notify')) {
        $notify.html(text);
    } else {
        var $last = $('.transit-notify:last');
        $notify = $('<div class="transit-notify">{1}</div>'.assign(text));
        $notify.css('top', $last.size() ? ($last.position().top + $last.height() + 10) : 0); 
        $notify.appendTo('body');
    }

    if ($.isFunction(waitFor)) {
        waitFor($notify);
    } else {
        // TODO 翻译消失时间设置为配置项
        $notify.delay(waitFor * 1000).fadeOut(function() {
            $(this).remove();
        });
    }
}
$.fn.notify = notify;

// 仅翻译英文
function canTranslate(text) {
	return PAT_ENGLISH.test(text);
}

function transIt(evt) {
    var selection = window.getSelection();
    var text = selection && (selection.toString() || '').trim();
    
    if (options.pageInspect && canTranslate(text)) {
        notify(TPLS.LOADING.assign(text), function($notify) {
            chrome.extension.sendMessage({ type: 'translate', from: 'page', text: text }, function(response) {
                $notify.notify(response.translation, options.notifyTimeout);
            });
        });
    }
}


function focusLink(evt) {
    if (options.linkInspect) {
        evt.stopPropagation();

        $link = $(this);
        evt.shiftKey && disableLink(evt);
    }
}

function blurLink(evt) {
    if (options.linkInspect) {
        evt.stopPropagation();

        if ($link) {
            if ($link.hasClass('transit-link')) {
                enableLink(evt, true);
            }
        }

        $link = null;
    }
}

// 暂时清除链接地址，以便对链接进行划词
function disableLink(evt) {
    if ($link && evt.shiftKey) {
        $link.data('transit-href', $link.attr('href')).removeAttr('href').addClass('transit-link');
    };
}

// 复原链接地址
function enableLink(evt, ignoreKey) {
    if ($link && (ignoreKey || evt.keyCode == 16)) {
        $link.attr('href', $link.data('transit-href')).removeClass('transit-link');
    }
}

// 清除选择
function clearSelection(evt) {
    // 当使用 Shift 作为辅助键时，清空之前的选择
    if (options.linkInspect && evt.button == 0 && evt.shiftKey) {
        window.getSelection().empty();
    }
}

initOptions(null, function(options) {
    $(document).on('mouseup', transIt);
    $(document).on('mouseenter', 'a', focusLink);
    $(document).on('mouseleave', 'a', blurLink);
    $(document).on('keydown', disableLink);
    $(document).on('keyup', enableLink);
    $(document).on('mousedown', clearSelection);
});
