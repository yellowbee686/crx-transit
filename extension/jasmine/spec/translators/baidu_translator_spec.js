describe('BaiduTranslator', function() {
  var translator = BaiduTranslator;

  it('should named baidu', function() {
    expect(translator.name).toEqual('baidu');
  });

  it('should translate empty text to null', function(done) {
    translator.translate('', function(result) {
      expect(result).toBeNull();
      done();
    });
  });

  it('should translate blank text to null', function(done) {
    translator.translate(' ', function(result) {
      expect(result).toBeNull();
      done();
    });
  });

  it('should translate invisible text to null', function(done) {
    translator.translate('\t     ', function(result) {
      expect(result).toBeNull();
      done();
    });
  });

  it('should returns translation and phonetic for word', function(done) {
    translator.translate('translate', function(result) {
      expect(result).not.toBeNull();
      expect(result.translation).toContain('vt.& vi. 翻译；解释；转化；被翻译');
      expect(result.phonetic).toEqual('[trænsˈlet, trænz-, ˈtrænsˌlet, ˈtrænz-]');
      done();
    });
  });

  it('should only returns translation for phrase', function(done) {
    translator.translate('good time', function(result) {
      expect(result).not.toBeNull();
      expect(result.translation).toContain('好的时间');
      expect(result.phonetic).not.toBeDefined();
      done();
    });
  });
});