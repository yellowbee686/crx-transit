var PAT_ENGLISH = /^[a-z]+(\'|\'s)?$/i;
var tpls = $.extend(tpls, {
    NOTIFY_LIST: ''
        + '<div id="transit-notify-list">'
        + '  <div class="transit-list-inner"></div>'
        + '</div>'
});

function canTranslate(text) {
    return PAT_ENGLISH.test(text);
}

function notify(text, waitFor) {
    var $notify = $(this);

    if ($notify.is('.transit-notify')) {
        $notify.html(text);
    } else {
        // Store selection in notify element.
        $notify = $(fmt(TPLS.NOTIFY, fmt(TPLS.LOADING, text)));
        $notify.data('text', text);
        if (options.notifyMode === 'margin') {
            $notify.prependTo(getNotifyList().find('.transit-list-inner'))
                   .fadeIn(autoFitNotifyList);
        } else {
            $notify.appendTo('body').fadeIn();
        }
    }

    if ($.isFunction(waitFor)) {
        waitFor($notify);
    } else {
        $notify.delay(waitFor * 1000).fadeOut(function() {
            $(this).remove();
            autoFitNotifyList();
        });
    }
}
$.fn.notify = notify;

// Find notify element by selection text `data-text`
function notifyExists(text) {
    var exists = false;

    $('.transit-notify').each(function() {
        if ($(this).data('text') === text) {
            exists = true;
            return false;
        }
    });

    return exists;
}

// When notify list is out of screen, set its height to fix window height.
// and enable scroll without showing scrollbar.
function autoFitNotifyList() {
    var listHeight = getNotifyList().find('.transit-list-inner').outerHeight(),
        windowHeight = $(window).height() + 10;
    getNotifyList().toggleClass('transit-list-full', listHeight > windowHeight);
}

function getNotifyList() {
    var $notifyList = $('#transit-notify-list');
    if ($notifyList.size() === 0) {
        log("Generating notification list at:", location.href);
        $notifyList = $(tpls.NOTIFY_LIST).appendTo('body');
    }
    
    return $notifyList;
}

function selectionHandler(request) {
    log('Selected:', request.text);

    // 检查这个单词是否在上次查询中已经用过了，如果是的话, 直接结束这个函数
    if (notifyExists(request.text)) return;

    // 如果页面划词开启，并且选中的文本符合划词的 PATTERN 才进行翻译
    if (!(options.pageInspect && canTranslate(request.text))) return;

    notify(request.text, function($notify) {
        log('Translating:', request.text);
        var message = { type: 'translate', from: 'page', text: request.text }
        chrome.extension.sendMessage(message, function(response) {
            log(request.text, 'translated to', response.translation);
            $notify.notify(response.translation, options.notifyTimeout);
        });
    });
}

initOptions(function() {
    $(window).on('resize', autoFitNotifyList);
    registerMessageDispatcher({ selection: selectionHandler });
    log('Initialized notify.user.js')   
});
