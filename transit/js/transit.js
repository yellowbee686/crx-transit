var PAT_ENGLISH = /[a-zA-Z-\'\s]+/img;

// 取消翻译
function cancel() {
	var result = this.querySelector('.transit-result');
	result && result.remove();
	this.className = 'transit';
	this.removeEventListener('dblclick', cancel);
}

// 翻译选中文本
function translate(selection)	{
	var range = selection.getRangeAt(0);
	if (range && !selection.isCollapsed) {
		if (selection.anchorNode.parentNode == selection.focusNode.parentNode) {
			// 防止对已经翻译胡文本进行叠加翻译
			if (selection.anchorNode.parentNode.className.indexOf('transit-') != -1) return;
			var span = null;
			
			// 重复利用之前生成的 source 元素
			if (selection.anchorNode.parentNode.className == 'transit') {
				span = selection.anchorNode.parentNode;
			} else {
				span = document.createElement('span');
				range.surroundContents(span);
			}
			span.className = 'transit-source';
			// TODO: 对选择的文本进行翻译
			span.innerHTML += '<span class="transit-result">(翻译结果)</em>';	

			span.addEventListener('dblclick', cancel, false);
		}
	}
}

// 仅翻译英文
function canTranslate(selection) {
	var text = selection && selection.toString() || '';
	return PAT_ENGLISH.test(text.replace(/(^\s+|\s+$)/mg, ''));
}

function transIt(evt){
	var selection = window.getSelection();
	canTranslate(selection) && translate(selection);
};

document.addEventListener('mouseup', transIt);