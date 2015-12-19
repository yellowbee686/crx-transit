function fmt() {
  var args = arguments;
  return args[0].replace(/#{(.*?)}/g, function(match, prop) {
    return function(obj, props) {
      var prop = /\d+/.test(props[0]) ? parseInt(props[0]) : props[0];
      if (props.length > 1) {
        return arguments.callee(obj[prop], props.slice(1));
      } else {
        return obj[prop] || '';
      }
    }(typeof args[1] === 'object' ? args[1] : args, prop.split(/\.|\[|\]\[|\]\./));
  });
}

function renderTranslation(query, result) {
  var locals = {
    className: 'transit-warning',
    query: query,
    result: {
      phonetic: '',
      translation: '未找到释义'
    },
  };

  if (result) {
    locals.className = 'transit-success';
    locals.result = result;
  }

  return fmt(
    '<div class="transit-result #{className}">' +
    '  <h6>#{query}</h6>' +
    '  <code>#{result.phonetic}</code>' +
    '  <pre>#{result.translation}</pre>' +
    '</div>', locals);
}

function clearSelection() {
  var selection = window.getSelection();
  if (selection) {
    selection.empty();
  }
}

function stopPropagation(event) {
  event.stopPropagation();
}

module.exports = {
  fmt: fmt,
  renderTranslation: renderTranslation,
  clearSelection: clearSelection,
  stopPropagation: stopPropagation
}; 