import BaiduTranslator from './baidu_translator';
import YoudaoTranslator from './youdao_translator';
import BingTranslator from './bing_translator';
import SanskritTranslator from './sanskrit_translator';

export default {
  baidu: BaiduTranslator,
  youdao: YoudaoTranslator,
  sanskrit: SanskritTranslator,
  bing: new BingTranslator(),
};
