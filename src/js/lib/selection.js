import 'sugar';

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


export default function getSelection(evt) {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (text) {
    return { text: text, position: getPosition(evt, selection) };
  } else {
    return null;
  }
}
