describe('YoudaoTranslator', function() {
  var translator = YoudaoTranslator;

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
      expect(result.translation).toContain('vt. 翻译；转化；解释；转变为；调动');
      expect(result.phonetic).toContain('træns\'leɪt');
      done();
    });
  });

  it('should only returns translation for phrase', function(done) {
    translator.translate('good time', function(result) {
      expect(result).not.toBeNull();
      expect(result.translation).toContain('好时机；繁荣时期');
      expect(result.phonetic).not.toBeDefined();
      done();
    });
  });
});