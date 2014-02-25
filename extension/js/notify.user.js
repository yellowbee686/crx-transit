var $notifyList = null;
var tpls = $.extend(tpls, {
    NOTIFY_LIST: ''
        + '<div id="transit-notify-list">'
        + '  <ul class="transit-list-inner"></ul>'
        + '</div>'
});

function prepareNotifyEnviroment() {
    log("Generating notification list at:", location.href);
    $notifyList = $(tpls.NOTIFY_LIST).appendTo('body');
    log($notifyList.get());
}

function translatingHandler(request) {
    log('Translating', request.text);
}

function translatedHandler() {
    log('Translated', request.text, 'to', request.result);
}

prepareNotifyEnviroment();
registerMessageDispatcher({
    translating: translatingHandler,
    translated: translatedHandler,
});