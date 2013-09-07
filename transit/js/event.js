var API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='

// Message Passing Listeners
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'translation') {
        console.log('Translating text:', request.text);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var result = JSON.parse(this.responseText);
                console.log('==>', result);
                result.errorCode || sendResponse({ result: result });
            }
        };
        xhr.open('GET', API_URL + encodeURIComponent(request.text), true);
        xhr.send();
    }

    return true;
});

