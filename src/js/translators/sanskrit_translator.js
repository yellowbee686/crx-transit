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
var async = require('../lib/async.min');

var convertMap = {
  'Ā' : 'ā',
  'Ī' : 'ī',
  'Ū' : 'ū',
  'Ṛ' : 'ṛ',
  'Ḷ' : 'ḷ',
  'Ṅ' : 'ṅ',
  'Ñ' : 'ñ',
  'Ṭ' : 'ṭ',
  'Ḍ' : 'ḍ',
  'Ṇ' : 'ṇ',  
  'Ś' : 'ś',
  'Ṣ' : 'ṣ',
  ' ' : '+'
};

// 将大写转为小写的形式，需要查询的网址中并没有大写的部分
function convertUpcase(text) {
  text = text.trim();
  var output = '';
  for (var index = 0; index < text.length; index++) {
    var element = text[index];
    if(convertMap[element]){
      output += convertMap[element];
    } else {
      output += element;
    }
  }
  return output;
}

var convertTokyoMap = {
  'ā' : 'A',
  'ī' : 'I',
  'ū' : 'U',
  'ṛ' : 'R',
  'ṝ' : 'RR',
  'ḷ' : 'IR',
  'ḹ' : 'IRR',
  'ṅ' : 'G',
  'ñ' : 'J',
  'ṭ' : 'T',  
  'ḍ' : 'D',
  'ṇ' : 'N',
  'ś' : 'z',
  'ṣ' : 'S',
  'ṃ' : 'M',
  'ḥ' : 'H',
};

// 将大写转为小写的形式，需要查询的网址中并没有大写的部分
function convertToTokyo(text) {
  text = text.trim();
  var output = '';
  for (var index = 0; index < text.length; index++) {
    var element = text[index];
    if(convertTokyoMap[element]){
      output += convertTokyoMap[element];
    } else {
      output += element;
    }
  }
  return output;
}

var inRom= ["7773","0257","0299","0363","7771","7735","7749","0241","7789","7693","7751","7747","7779","0347","7717"];
var outVH= [".rr","aa","ii","uu",".r",".l","f","~n",".t",".d",".n",".m",".s","z",".h"];

function convert(orig) {
	var output='';
	for(var i=0;i<orig.length;i++){
		var origC=orig.charAt(i);
		var l=orig.charCodeAt(i);
		var lenL=l.length;
		if(lenL==0) l='0000';
		if(lenL==1) l='000' +l;
		if(lenL==2) l='00' +l;
		if(lenL==3) l='0' +l;
		var check=l;
		var isC=false;
		for(var j=0;j<inRom.length;j++){
      if(check==inRom[j]){
			  output=output.concat(outVH[j]);isC=true;
      }
		}
		if(!isC){
      output=output.concat(origC);
		}
  }
  return output;
}

const mark = "showBox('";
const markLen = mark.length;
const postMark = ']<a href=&quot;javascript:hideBox()';
const bracket = '<';
const rbracket = '>';
const unicodeStart = '&#';
const unicodeEnd = ';';

function parseHTML(text) {
  var arr = new Array();
  var idx = 0;
  idx = text.indexOf(mark, idx);
  while (idx != -1) {
    var lastIdx = text.indexOf(postMark, idx);
    var during = text.substring(idx + markLen, lastIdx); //中间的字符需要去除所有<>中间的部分
    var pure = '';
    //剔除尖括号内的html部分
    var start = false;
    for (var i = 0; i < during.length; i++) {
      var ch = during[i];
      if (ch == bracket) {
        start = true;
      } else if (ch == rbracket) {
        start = false;
        continue;
      }
      if (!start) {
        pure += ch;
      }
    }
    idx = text.indexOf(mark, idx + markLen);
    var needParse = pure;
    //needParse一定是以{开头
    do{
      var bigIdx = needParse.indexOf('{', 1); //检查是否有嵌套的另一个词
      if(bigIdx!=-1){ //有并排的另一个词或嵌套的词
        pure = needParse.substr(0, bigIdx);
        needParse = needParse.substr(bigIdx);
      } else {
        pure = needParse;
        needParse = '';
      }

      var start = pure.indexOf('[');
      var vol = pure.substring(0, start); //截取词性
      pure = pure.substr(start + 1);
      var i = pure.indexOf(unicodeStart);
      var result = '';
      var last = 0;
      //转码为字符
      while (i != -1) {
        result += pure.substring(0, i);
        last = pure.indexOf(unicodeEnd);
        var during = pure.substring(i + 2, last);
        result += String.fromCharCode(parseInt(during));
        if (last >= pure.length - 1) {
          break;
        }
        pure = pure.substr(last + 1);
        i = pure.indexOf(unicodeStart);
      }
      result += pure; //补上最后一段正常的
      result = result.replace(']','');
      pure = result.trim();
      //还有可能被-分割，这种只查前面的词
      var pureArr = pure.split('-');
      if (pureArr.length >= 2) {
        pure = pureArr[0];
      }
      //pure还需要分析下划线，如果后面不是数字，则表示没查到，拆成两个词丢给mdict查询，即arr要再push一个
      pureArr = pure.split('_');
      if (pureArr.length >= 2) {
        var num = parseInt(pureArr[1]);
        if (isNaN(num)) {
          for(var ii = 0;ii<pureArr.length;ii++){
            arr.push({vol:vol, word:pureArr[ii]});
          }
          continue;
        } else {
          //pure = pureArr[0]+' '+pureArr[1];
          pure = pureArr[0];
        }
      }
      arr.push({vol:vol, word:pure});
    }while(needParse.length>0)
  }
  for(var i=0;i<arr.length;i++){
    arr[i].word = convertToTokyo(arr[i].word);
  }
  return arr;
}

function format(result) {
  if (!result || !result.length) return null;
  var response = {};
  response.translation = '';
  for (var k = 0; k < result.length; k++) {
    var item = result[k];
    var ic = item.content;
    if (ic && ic.length) {
      for (var i = 0; i < ic.length; i++) {
        response.translation += ic[i].title + '<br/><br/>';
        response.translation += item.vol + '<br/><br/>';
        var content = ic[i].content;
        for (var j = 0; j < content.length; j++) {
          response.translation += content[j] + '<br/><br/>';
        }
      }
    }
    response.translation += '<br/><br/>';
  }
  return response;
}

const API_URL = 'http://sanskrit.inria.fr/cgi-bin/SKT/sktgraph?lex=SH&st=t&us=f&cp=t&text=';
const URL_POSTFIX = '&t=VH&topic=&mode=g';

function request(text, callback) {
  var formatted = convert(convertUpcase(text));
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var result = this.responseText;
      if (result != '') {
        var arr = parseHTML(result);
        //console.log('http result text: ' + arr[0]);
        var resultArr = [];
        var realKeys = [];
        // 先查一遍每个词的列表，如果有相同的，则加入realKeys中，最终在realKeys中查询
        async.eachSeries(arr, function (item, cb) {
          //倒数第二个是空格，则已经是有数字标记的，不应该再到字典中查key了
          if(item.word[item.word.length-2]==' '){
            realKeys.push(item);
            cb();
          } else {
            chrome.extension.sendMessage({ type: 'searchSanskrit', query: {phrase: item.word, max: 10} }, function (ret) {
              for(var j=0;j<ret.length;j++){
                var keyArr = ret[j].content;
                for(var i=0;i<keyArr.length;i++){
                  var key = keyArr[i];
                  //如果有原始的词，则只查原始的词
                  if(key == item.word){
                    realKeys.push(item);
                    break;
                  }
                  if(key.indexOf(item.word+' ')!=-1){
                    realKeys.push({vol:item.vol, word:key});
                  }
                }
              }
              cb();
            });
          }
        }, function (err) {
          if (err) {
            callback('');
          } else {
            async.eachSeries(realKeys, function (item, cb) {
              chrome.extension.sendMessage({ type: 'searchSanskrit', query: item.word }, function (content) {
                resultArr.push({vol:item.vol, content:content});
                cb();
              });
            }, function (err) {
              if (err) {
                callback('');
              } else {
                callback(format(resultArr));
              }
            });
          }
        });
      } else {
        console.log('http timeout');
        callback('');
      }
    }
  };
  xhr.open('GET', API_URL + formatted + URL_POSTFIX, true);
  xhr.send();
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
