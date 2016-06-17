/**
 * Bing Translator
 */
import sugar from 'sugar';
import $ from 'jquery';
import { sanitizeHTML } from '../lib/utils';

const DICT_URL = 'http://cn.bing.com/dict/search';
const TRANSLATE_URL = 'http://cn.bing.com/translator/api/Translate/TranslateArray?from=-&to=zh-CHS';
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

  _parseWord(page) {
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

  _parseText(data) {
    const translation = data.items.map(item => item.text).join('<br/><br/>');

    return { translation: translation };
  }

  _requestWord(text, callback) {
    const settings = {
      url: DICT_URL,
      data: { q: text },
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.8'
      }
    };

    $.ajax(settings)
      .done(page => callback(this._parseWord(page)))
      .fail(() => callback(null));
  }

  _buildLine(text, index) {
    console.log(text, index);
    const timestamp = new Date().getTime();
    
    return {
      id: timestamp + index,
      text: text
    };
  }

  _splitLines(text) {
    return text.split(/\s*\n\s*/mg).map(this._buildLine);
  }

  _requestText(text, callback) {
    const settings = {
      url: TRANSLATE_URL,
      type: 'POST',
      data: JSON.stringify(this._splitLines(text)),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.8'
      }
    };

    $.ajax(settings)
      .done(data => callback(this._parseText(data)))
      .fail(() => callback(null));
  }

  translate(text, callback) {
    if (/^\s*$/.test(text)) {
      callback(null);
    } else if (/^[a-zA-Z]+$/.test(text)) {
      this._requestWord(text, callback);
    } else {
      this._requestText(text, callback);
    }
  }
}
