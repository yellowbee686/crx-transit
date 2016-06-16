import BaiduTranslator from './baidu_translator';
import YoudaoTranslator from './youdao_translator';
import BingTranslator from './bing_translator';

export default {
  baidu: BaiduTranslator,
  youdao: YoudaoTranslator,
  bing: new BingTranslator(),
};
