// Chrome disabled contentscript in webstroe.
// via: http://stackoverflow.com/a/11614440/260793

var $link = null;

function getSelectionRect(evt) {
    var rect = document.getSelection().getRangeAt(0).getBoundingClientRect();

    // 如果是在文本框中，这个坐标返回的会为 0，此时应该取鼠标位置
    if (rect.left === 0 && rect.top === 0) {
        rect = { left: evt.clientX, top: evt.clientY, height: 15 };
    }

    var left = rect.left + document.body.scrollLeft;
    var top  = rect.top + document.body.scrollTop;

    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    if (clientHeight === 0) {
        clientHeight = document.documentElement.clientHeight;
    }
    if (rect.top >= 150) {
        var bottom = clientHeight - top;
        return { left: left, bottom: bottom };
    } else {
        return { left: left, top: top + rect.height + 5 };
    }
}

function transIt(evt) {
    var text = $.trim(window.getSelection().toString());
    var position = getSelectionRect(evt);
    
    if (text) {
        chrome.runtime.sendMessage({ type: 'selection', text: text, position: position });
        if (options.notifyMode === 'in-place') {
            doNotify(text, position);
        }
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

initOptions(function(options) {
    $(document).on('mouseup', transIt);
    $(document).on('mouseenter', 'a', focusLink);
    $(document).on('mouseleave', 'a', blurLink);
    $(document).on('keydown', disableLink);
    $(document).on('keyup', enableLink);
    $(document).on('mousedown', clearSelection);
    log('action.user.js initialized.')
});
