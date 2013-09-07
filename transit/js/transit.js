var PAT_ENGLISH = /^[a-zA-Z-\'\s]+$/img;
var timer = null;

// 取消翻译
function cancel() {
	var result = this.querySelector('.transit-result');
	result && result.remove();
	this.className = 'transit';
	this.removeEventListener('dblclick', cancel);
}

function showPopup(text) {
    var popup = document.getElementById('transit-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'transit-popup';
        document.body.appendChild(popup);
    }
    popup.innerHTML = text;
    popup.style.display = 'block';

    timer && clearTimeout(timer);
    timer = setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}

function youdaoTranslateCallback() {
    if (this.readyState == 4) {
        var result = JSON.parse(this.responseText);
        result.errorCode || showPopup(getTranslations(result));
    }
}

// 翻译选中文本
function translate(text) {
    chrome.runtime.sendMessage({ type: 'translation', text: text }, function(response) {
        showPopup(getTranslation(response.result));
    });
}

// 仅翻译英文
function canTranslate(text) {
	return PAT_ENGLISH.test(text);
}

function transIt(evt){
	var selection = window.getSelection();
	var text = selection && strip(selection.toString()) || '';
	canTranslate(text) && translate(text);
};

document.addEventListener('mouseup', transIt);
