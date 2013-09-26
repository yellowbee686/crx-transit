var source = document.getElementById('source'),
    result = document.getElementById('result');

function transit(evt) {
	if (evt.keyCode != 13) return;
	if (source.value.isBlank()) return;

    chrome.runtime.sendMessage({ type: 'translate', text: source.value.trim() }, function(response) {
        result.innerHTML = response.translation;
    });

    return false;
}

// 在输入框中按下回车键后进行查询
source.addEventListener('keypress', transit, false)
source.focus();