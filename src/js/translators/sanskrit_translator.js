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
  while(idx!=-1){
    var lastIdx = text.indexOf(postMark, idx);
    var during = text.substring(idx+markLen, lastIdx); //中间的字符需要去除所有<>中间的部分
    var pure = '';
    var start = false;
    for(var i = 0;i<during.length;i++){
      var ch = during[i];
      if(ch == bracket){
        start = true;
      } else if(ch == rbracket){
        start = false;
        continue;
      }
      if(!start){
        pure += ch;
      }
    }
    idx = text.indexOf(mark, idx+markLen);
    //还需要转码为字符
    //pure = pure.replace(new RegExp('&#','gm'),'\\u');
    //pure = pure.replace(new RegExp(';','gm'),'');
    //前面花括号中的暂时不保留，以后需要用到再存储
    var start = pure.indexOf('[');
    //var last = pure.indexOf(']');
    //pure = pure.substr(start+1, last - start - 1);
    pure = pure.substr(start+1);
    // 有些会嵌套答案写在后面，比如buddha { pp. }[budh_1] 暂时只留前面不解析后面
    var bigStart = pure.indexOf('{');
    if(bigStart!=-1){
      pure = pure.substr(0, bigStart).trim();
    }
    var i = pure.indexOf(unicodeStart);
    var result = '';
    var last = 0;
    while(i!=-1){
      result += pure.substring(0, i);
      last = pure.indexOf(unicodeEnd);
      var during = pure.substring(i+2, last);
      result += String.fromCharCode(parseInt(during));
      if(last>=pure.length-1){
        break;
      }
      pure = pure.substr(last+1);
      i = pure.indexOf(unicodeStart);
    }
    result += pure; //补上最后一段正常的
    pure = result;
    //pure还需要分析下划线，如果后面不是数字，则表示没查到，拆成两个词丢给mdict查询，即arr要再push一个
    var pureArr = pure.split('_');
    if(pureArr.length>=2){
      var num = parseInt(pureArr[1]);
      if(isNaN(num)){
        arr = arr.concat(pureArr);
        continue;
      } else {
        pure = pureArr[0];
      }
    }
    arr.push(pure);
  }
  return arr;
}

function format(result) {
  if (!result || !result.length) return null;
  var response = {};
  response.translation = '';
  for(var k=0;k<result.length;k++){
    var item = result[k];
    if(item && item.length){
      for(var i=0;i<item.length;i++){
        response.translation += item[i].title+'<br/><br/>';
        var content = item[i].content;
        for(var j=0;j<content.length;j++){
          response.translation += content[j]+'<br/><br/>';
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
  //app.log('sanskrit request ', app.options.dictfiles);
  console.log('original text: ' + text);
  var formatted = convert(convertUpcase(text));
  console.log('formatted text: ' + formatted);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var result = this.responseText;
      if(result != ''){
        var arr = parseHTML(result);
        console.log('http result text: ' + arr[0]);
        var resultArr = [];
        async.eachSeries(arr, function(item, cb){
          item = convertToTokyo(item);
          chrome.extension.sendMessage({type: 'searchSanskrit', text: item }, function(content) {
            resultArr.push(content);
            cb();
          });
        }, function(err){
          if(err){
            callback('');
          } else {
            callback(format(resultArr));
          }
        });
        // chrome.extension.sendMessage({type: 'searchSanskrit', text: arr[0] }, function(content) {
        //   callback(format(content));
        //   console.log('--');
        // });
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
