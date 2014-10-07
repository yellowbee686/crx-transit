/**
 * 百度翻译的 API 支持
 *
 * http://developer.baidu.com/wiki/index.php?title=%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3%E9%A6%96%E9%A1%B5/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91API
 */
BaiduTranslator = new function() {
  this.name = 'baidu';

  var WORD_URL = 'http://openapi.baidu.com/public/2.0/translate/dict/simple?client_id=hXxOZlP7bsOYFS6EFRmGTOe5&from=en&to=zh&q='
  var PHRASE_URL = 'http://openapi.baidu.com/public/2.0/bmt/translate?client_id=hXxOZlP7bsOYFS6EFRmGTOe5&from=en&to=zh&q='

  var format = function(result) {
    if (!result || result.errno) return null;
    var response = {};
    
    console.log(result);
    var symbol = result.data.symbols[0];
    if (symbol.ph_am) {
      response.phonetic = '[' + symbol.ph_am + ']';
    }
    response.translation = symbol.parts.map(function(part) {
      return part.part + ' ' + part.means.join('；');
    }).join('<br/>');

    return response;
  };

  var request_word = function(text, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        var result = JSON.parse(this.responseText);
        callback(format(result));
      }
    };
    xhr.open('GET', WORD_URL + encodeURIComponent(text), true);
    xhr.send();
  };

  var request_phrase = function(text, callback) {
  };

  this.translate = function(text, callback) {
    if (/^\s*$/.test(text)) {
      callback(null);
    } else if (/^[a-zA-Z]+$/.test(text)) {
      request_word(text, callback);
    } else {
      request_phrase(text, callback);
    }
  }
};