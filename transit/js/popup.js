var inputSource = document.getElementById('source'),
    textResult = document.getElementById('result'),
    formSearch = document.getElementById('form-search');

function transit(e) {
    var text = strip(inputSource.value);

    chrome.runtime.sendMessage({ type: 'translate', text: text }, function(response) {
        textResult.innerHTML = response.translation;
    });

    return false;
}

inputSource.focus();
formSearch.onsubmit = transit;

