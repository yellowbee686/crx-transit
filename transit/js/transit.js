var PAT_ENGLISH = /^[a-zA-Z-\'\s]+$/img;
var API_URL = 'http://fanyi.youdao.com/openapi.do?keyfrom=TransIt&key=597592531&type=data&doctype=json&version=1.1&q='
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

function getTranslations(result) {
    if (result.basic) {
        return result.basic.explains.join('<br/>');
    } else if (result.translation) {
        return result.translation.join('<br />');
    } else {
        return '<div class="transit-error">未查询到释义</div>';
    }
}

function youdaoTranslateCallback() {
    if (this.readyState == 4) {
        var result = JSON.parse(this.responseText);
        console.log(result);
        result.errorCode || showPopup(getTranslations(result));
    }
}

// 翻译选中文本
function translate(text) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = youdaoTranslateCallback;
    xhr.open('GET', API_URL + encodeURIComponent(text), true);
    xhr.send();
}

// 仅翻译英文
function canTranslate(text) {
	return PAT_ENGLISH.test(text);
}

function transIt(evt){
	var selection = window.getSelection();
	var text = selection && selection.toString().replace(/(^\s+|\s+$)/g, '') || '';
	canTranslate(text) && translate(text);
};

document.addEventListener('mouseup', transIt);
