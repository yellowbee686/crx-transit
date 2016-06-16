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

  _parse(page) {
    var $result = $(sanitizeHTML(page));

    // if (!$result.find('.lf_area').length) return;

    if ($result.find('.qdef').length) {
      var response = {};

      var $phonetic = $result.find('.hd_prUS');
      if ($phonetic.length) {
        response.phonetic = $phonetic.text().replace('美 ', '');
      }
      
      var $means = $result.find('.hd_area + ul > li');
      response.translation = $means.map(function() {
        const pos = $(this).find('.pos').text();
        const def = $(this).find('.def').text();

        return `${pos} ${def}`;
      }).toArray().join('<br/>');

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
