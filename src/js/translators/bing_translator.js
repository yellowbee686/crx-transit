/**
 * Bing Translator
 */
import sugar from 'sugar';
import $ from 'jquery';
import { sanitizeHTML } from '../lib/utils';

const API_URL = 'http://cn.bing.com/dict/search';
const REFERER = 'http://cn.bing.com/dict/?mkt=zh-cn&setlang=zh';

export default class BingTranslator {
  constructor() {
    this.name = 'bing';
  }

  _parseMean(index, meanNode) {
    const $mean = $(meanNode);
    const def = $mean.find('.def').text();
    let   pos = $mean.find('.pos').text();

    if (pos == '网络') {
      pos = index > 0 ? '<br/><strong>网络：</strong><br/>' : '';
    } else {
      pos = `${pos} `;
    }

    return `${pos}${def}`;
  }

  _parse(page) {
    var $result = $(sanitizeHTML(page));

    if ($result.find('.qdef').length) {
      var response = {};

      var $phonetic = $result.find('.hd_prUS');
      if ($phonetic.length) {
        response.phonetic = $phonetic.text().replace('美 ', '');
      }
      
      var $means = $result.find('.hd_area + ul > li');
      response.translation =
        $means.map(this._parseMean).toArray().join('<br/>');

      return response;
    } else if ($result.find('.p1-11')) {
      return { translation: $result.find('.p1-11').text() };
    } else {
      return null;
    }
  }

  _request(text, callback) {
    const settings = {
      url: API_URL,
      data: { q: text },
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.8'
      }
    };

    $.ajax(settings)
      .done(page => callback(this._parse(page)))
      .fail(() => callback(null));
  }

  translate(text, callback) {
    if (/^\s*$/.test(text)) {
      callback(null);
    } else {
      this._request(text, callback);
    }
  }
}
