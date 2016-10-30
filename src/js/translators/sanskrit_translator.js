/**
 * 梵文翻译支持
 *
 * 
 * 
 * 
 */

import app from '../config/application';
// import MCommon from '../lib/mdict_js/mdict-common'
// import MParser from '../lib/mdict_js/mdict-parser'
// import MRenderer from '../lib/mdict_js/mdict-renderer'

function format(result) {
  if (!result || !result.length) return null;
  var response = {};
  response.translation = '';
  for(var i=0;i<result.length;i++){
    response.translation += result[i]+'<br/><br/>';
  }
  return response;

  // if (result.basic) {
  //   response.translation = result.basic.explains.join('<br/>');
  //   if (result.basic.phonetic) {
  //     response.phonetic = '[' + result.basic.phonetic + ']';
  //   }
  // } else if (result.translation) {
  //   response.translation = result.translation.join('<br/>');
  // }
  
  // if (result.web) {
  //   response.web = result.web.map(function(kv) {
  //     return kv.key + ': ' + kv.value.join('；');
  //   }).join('<br/>');
  // }

  // if (response.translation.toLowerCase() == result.query.toLowerCase()) {
  //   return null;
  // } else {
  //   return response;
  // }
}

function request(text, callback) {
  //app.log('sanskrit request ', app.options.dictfiles);
  console.log(text + '');
  chrome.extension.sendMessage({type: 'searchSanskrit', text: text }, function(content) {
    callback(format(content));
    console.log('--');
  });
};

var SanskritTranslator = { name: 'sanskrit' };
  
SanskritTranslator.translate = function(text, callback) {
  if (/^\s*$/.test(text)) {
    callback(null);
  } else {
    request(text, callback);
  }
};

module.exports = SanskritTranslator;
