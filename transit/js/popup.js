var app    = chrome.extension.getBackgroundPage(),
	source = document.getElementById('source'),
    result = document.getElementById('result'),
    toggle = document.getElementById('toggle');

// 查询单词
function transit(evt) {
	if (evt.keyCode != 13) return;
	if (source.value.isBlank()) return;

    chrome.extension.sendMessage({ type: 'translate', text: source.value.trim() }, function(response) {
        result.innerHTML = response.translation;
    });

    return false;
}

// 启用和禁用页面划词
function togglePageSelection() {
	app.settings(this.name, this.checked);
}

// 在输入框中按下回车键后进行查询
source.addEventListener('keypress', transit, false);
toggle.addEventListener('change', togglePageSelection, false);
source.focus();