var PAT_ENGLISH = /^[a-zA-Z-\'\s]+$/img;
var timer = null;
var $link = null;

function showPopup(text, keep) {
    var popup = document.getElementById('transit-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'transit-popup';
        document.body.appendChild(popup);
    }
    popup.innerHTML = text;
    popup.style.display = 'block';

    timer && clearTimeout(timer);
    if (!keep) {
        // TODO 翻译消失时间设置为配置项
        timer = setTimeout(function() {
            popup.style.display = 'none';
        }, 5000);
    }
}

// 翻译选中文本
function translate(text) {
    chrome.extension.sendMessage({ type: 'translate', from: 'page', text: text }, function(response) {
        showPopup('<h6 class="success">' + text + '</h6>' + response.translation);
    });
}

// 仅翻译英文
function canTranslate(text) {
	return PAT_ENGLISH.test(text);
}

function transIt(evt) {
    var selection = window.getSelection();
    var text = selection && strip(selection.toString()) || '';
    
    if (canTranslate(text)) {
        showPopup('<div class="success">正在翻译...</div>', true);
        translate(text);
    }
}


function focusLink(evt) {
    evt.stopPropagation();

    $link = $(this);
    evt.shiftKey && disableLink(evt);
}

function blurLink(evt) {
    evt.stopPropagation();

    if ($link) {
        if ($link.hasClass('transit-link')) {
            enableLink(evt, true);
        }
    }

    $link = null;
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
    if (evt.button == 0 && evt.shiftKey) {
        window.getSelection().empty();
    }
}

$(document).on('mouseup', transIt);
$(document).on('mouseenter', 'a', focusLink);
$(document).on('mouseleave', 'a', blurLink);
$(document).on('keydown', disableLink);
$(document).on('keyup', enableLink);
$(document).on('mousedown', clearSelection);
