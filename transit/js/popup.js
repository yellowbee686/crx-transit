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


function initialize() {
	// 事件注册
	source.addEventListener('keypress', transit, false);
	toggle.addEventListener('change', togglePageSelection, false);

	// 读取初始配置
	if (app.settings(toggle.name) == null) {
		app.settings(toggle.name, true);
	}

	toggle.checked = app.settings(toggle.name); 
	source.focus();
}

initialize();