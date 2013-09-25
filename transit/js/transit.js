var PAT_ENGLISH = /^[a-zA-Z-\'\s]+$/img;
var timer = null;
var currentLink = null;

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
    chrome.runtime.sendMessage({ type: 'translate', text: text }, function(response) {
        showPopup(response.translation);
    });
}

// 仅翻译英文
function canTranslate(text) {
	return PAT_ENGLISH.test(text);
}

function transIt(evt) {
	var selection = window.getSelection();
	var text = selection && strip(selection.toString()) || '';
	canTranslate(text) && translate(text);
}

// 复原链接地址
function enableLink() {
    if (currentLink && currentLink.hasAttribute('data-transit-href')) {
        currentLink.setAttribute('href', currentLink.getAttribute('data-transit-href'));
        currentLink.removeAttribute('data-transit-href');
        currentLink.removeEventListener('mouseout', enableLink);
        currentLink = null;
    }
    currentLink = null;
}

function findLink(element) {
    if (element.nodeName == 'BODY') return false;
    if (element.nodeName == 'A') return element;
    return findLink(element.parentNode);
}

// 暂时清除链接地址，以便对链接进行划词
function disableLink(evt) {
    if (currentLink) return;

    var link = findLink(evt.target);
    if (link) {
        currentLink = link;
        currentLink.addEventListener('mouseout', enableLink, false);
        setTimeout(function() {
            if (currentLink && currentLink.hasAttribute('href')) {
                currentLink.setAttribute('data-transit-href', currentLink.getAttribute('href'));
                currentLink.removeAttribute('href');
            }
        }, 1500);
        // TODO: 鼠标悬停时间设置为可配置值
    }
}

document.addEventListener('mouseup', transIt, false);
document.addEventListener('mousemove', disableLink, false);