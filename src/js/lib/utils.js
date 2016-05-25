export function renderTranslation(query, result) {
  let phonetic = '';
  let translation = '未找到释义';
  let className = 'transit-warning';

  if (result) {
    phonetic = result.phonetic;
    translation = result.translation;
    className = 'transit-success';
  }

  return `` +
    `<div class="transit-result ${className}">` +
    `  <h6>${query}</h6>` +
    `  <code>${phonetic}</code>` +
    `  <pre>${translation}</pre>` +
    `</div>`;
}

export function clearSelection() {
  var selection = window.getSelection();
  if (selection) {
    selection.empty();
  }
}

export function sanitizeHTML(html) {
  var match = html.match(/<body[\s\S]*<\/body>/img);
  return match[0].replace(/<script([\s\S]*?)<\/script>/img, '');
}

export function stopPropagation(event) {
  event.stopPropagation();
}
