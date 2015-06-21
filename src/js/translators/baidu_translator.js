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
  if (!result || result.errno || !result.data.length) return null;
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

var BaiduTranslator = { name: 'baidu' };

BaiduTranslator.translate = function(text, callback) {
  if (/^\s*$/.test(text)) {
    callback(null);
  } else if (/^[a-zA-Z]+$/.test(text)) {
    request_word(text, callback);
  } else {
    request_phrase(text, callback);
  }
};

module.export = BaiduTranslator;