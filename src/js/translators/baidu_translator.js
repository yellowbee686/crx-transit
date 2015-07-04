/**
 * 百度翻译的 API 支持
 *
 * http://dwz.cn/bau5M
 * 
 * jshint strict:true
 */

var WORD_URL = 'http://openapi.baidu.com/public/2.0/translate/dict/simple?client_id=hXxOZlP7bsOYFS6EFRmGTOe5&from=en&to=zh&q=';
var PHRASE_URL = 'http://openapi.baidu.com/public/2.0/bmt/translate?client_id=hXxOZlP7bsOYFS6EFRmGTOe5&from=en&to=zh&q=';

function formatWord(result) {
  if (!result || result.errno || result.data.length === 0) return null;
  var response = {};
  
  var symbol = result.data.symbols[0];
  if (symbol.ph_am) {
    response.phonetic = '[' + symbol.ph_am + ']';
  }
  response.translation = symbol.parts.map(function(part) {
    return part.part + ' ' + part.means.join('；');
  }).join('<br/>');

  return response;
}

function formatPhrase(result) {
  if (!result) return null;

  var response = {};
  var trans_result = result.trans_result[0];

  if (trans_result.src == trans_result.dst) return null;

  response.translation = trans_result.dst;

  return response;
}

function requestWord(text, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var result = JSON.parse(this.responseText);
      callback(formatWord(result));
    }
  };
  xhr.open('GET', WORD_URL + encodeURIComponent(text), true);
  xhr.send();
}

function requestPhrase(text, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var result = JSON.parse(this.responseText);
      callback(formatPhrase(result));
    }
  };
  xhr.open('GET', PHRASE_URL + encodeURIComponent(text), true);
  xhr.send();
}

var BaiduTranslator = { name: 'baidu' };

BaiduTranslator.translate = function(text, callback) {
  if (/^\s*$/.test(text)) {
    callback(null);
  } else if (/^[a-zA-Z]+$/.test(text)) {
    requestWord(text, callback);
  } else {
    requestPhrase(text, callback);
  }
};

module.exports = BaiduTranslator;