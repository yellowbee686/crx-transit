/**
 * Bing Translator
 */
import sugar from 'sugar';
import $ from 'jquery';
import utils from '../lib/utils';

// function formatWord(result) {
//   var $result = $(result);

//   if (!$result.find(SEL_WORD).length) return null;

//   var response = {};
  
//   var $phonetic = $result.find(SEL_WORD_PHONETIC);
//   if ($phonetic.length) {
//     response.phonetic = $phonetic.text();
//   }
  
//   var $means = $result.find(SEL_WORD_MEANS);
//   response.translation = $means.map(function() {
//     return $(this).text();
//   }).toArray().join('<br />');

//   return response;
// }

const API_URL = 'http://cn.bing.com/dict/search';
const REFERER = 'http://cn.bing.com/dict/?mkt=zh-cn&setlang=zh';

export default class BingTranslator {
  constructor() {
    this.name = 'bing';
  }

  _parse(page) {
    console.log(page);
  }

  _request(text, callback) {
    const settings = {
      url: API_URL,
      data: { q: text },
      headers: {
        'Referer': 'http://cn.bing.com/dict/?mkt=zh-cn&setlang=zh',
        'Accept-Language': 'zh-CN,zh;q=0.8'
      }
    };

    $.ajax(settings)
      .done(page => self._parse(page))
      .fail(() => callback(null));
  }

  translate(text, callback) {
    if (/^\s*$/.test(text)) {
      callback(null);
    } else {
      self._request(text, callback);
    }
  }
}
