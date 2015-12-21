/**
 * 百度翻译的 API 支持
 *
 * http://dwz.cn/bau5M
 * 
 * jshint strict:true
 */

var md5 = require('blueimp-md5').md5;
var crxkit = require('../lib/crxkit');
var $ = require('jquery');

var API_URL = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
var APP_ID  = '20151216000007851';
var APP_KEY = 'WdE6aTkJySOYyyEVTFGI';

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

function requestPayload(text) {
  var salt = new Date().getTime();
  var sign = md5(APP_ID + text + salt + APP_KEY);

  return {
    q: text,
    appid: APP_ID,
    salt: salt,
    from: 'auto',
    to: 'zh',
    sign: sign
  };
}

function request(text, callback) {
  $.ajax({
    url: API_URL,
    type: 'POST',
    dataType: 'json',
    data: requestPayload(text),
    success: function(data) {
      crxkit.log(result);
      callback(format(result));
    } 
  });
}


var BaiduTranslator = { name: 'baidu' };

BaiduTranslator.translate = function(text, callback) {
  if (/^\s*$/.test(text)) {
    callback(null);
  } else {
    request(text, callback);
  }
};

module.exports = BaiduTranslator;