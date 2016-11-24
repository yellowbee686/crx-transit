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
    response.translation += result[i].title+'<br/><br/>';
    var content = result[i].content;
    for(var j=0;j<content.length;j++){
      response.translation += content[j]+'<br/><br/>';
    }
  }
  return response;
}

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

function parseHTML(text) {
  var arr = new Array();
  var idx = 0;
  idx = text.indexOf(mark, idx);
  while(idx!=-1){
    var lastIdx = text.indexOf(postMark);
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
    //还需要转码为字符
    
    //pure还需要分析下划线，如果后面不是数字，则表示没查到，拆成两个词丢给mdict查询，即arr要再push一个
    

    arr.push(pure);
  }
  return arr;
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
      var result = JSON.parse(this.responseText);
      console.log('http result text: ' + result);
      chrome.extension.sendMessage({type: 'searchSanskrit', text: result }, function(content) {
        callback(format(content));
        console.log('--');
      });
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
