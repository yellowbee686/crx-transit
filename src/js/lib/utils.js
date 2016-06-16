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
    `  <code>${phonetic || ''}</code>` +
    `  <pre>${translation}</pre>` +
    `</div>`;
}

function getClientHeight() {
  const bodyHeight = document.body.clientHeight;
  const docHeight  = document.documentElement.clientHeight;

  let clientHeight = bodyHeight < docHeight ?  bodyHeight: docHeight;
  if (clientHeight === 0) {
    clientHeight = docHeight;
  }

  return clientHeight;
}

function getPosition(evt, selection) {
  let rect = selection.getRangeAt(0).getBoundingClientRect();

  // Use mouse position if selection range position invalid (in text field)
  if (rect.left === 0 && rect.top === 0) {
    rect = { left: evt.clientX, top: evt.clientY, height: 15 };
  }

  const left = rect.left + document.body.scrollLeft;
  const top  = rect.top + document.body.scrollTop;

  if (rect.top >= 150) {
    return { left: left, bottom: getClientHeight() - top };
  } else {
    return { left: left, top: top + rect.height + 5 };
  }
}

export function getSelection(evt) {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (text) {
    return { text: text, position: getPosition(evt, selection) };
  } else {
    return null;
  }
}

export function clearSelection() {
  const selection = window.getSelection();
  if (selection) {
    selection.empty();
  }
}

export function sanitizeHTML(html) {
  var match = html.match(/<body[\s\S]*<\/body>/img);
  return match[0].replace(/<script([\s\S]*?)<\/script>/img, '')
                 .replace(/<style([\s\S]*?)<\/style>/img, '')
                 .replace(/<img([\s\S]*?)>/img, '')
                 .replace(/<video([\s\S]*?)>/img, '');
}

export function stopPropagation(event) {
  event.stopPropagation();
}
