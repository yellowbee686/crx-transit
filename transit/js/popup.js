var inputSource = document.getElementById('source'),
    textResult = document.getElementById('result'),
    formSearch = document.getElementById('form-search');

function transit(e) {
    var text = strip(inputSource.value);

    chrome.runtime.sendMessage({ type: 'translation', text: text }, function(response) {
        textResult.innerHTML = getTranslation(response.result);
    });

    return false;
}

inputSource.focus();
formSearch.onsubmit = transit;

