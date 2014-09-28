describe('YoudaoTranslator', function() {
  var translator = YoudaoTranslator;

  describe('empty text', function() {
    var response;

    beforeEach(function(done) {
      translator.translate('', function(result) {
        response = result;
        done();
      });
    });

    it('should translate to null', function(done) {
      expect(response).toBeNull();
      done();
    });
  });


  describe('blank text', function() {
    var response;
    
    beforeEach(function(done) {
      translator.translate(' ', function(result) {
        response = result;
        done();
      });
    });

    it('should translate to null', function(done) {
      expect(response).toBeNull();
      done();
    });
  });

  describe('invisible text', function() {
    beforeEach(function(done) {
      translator.translate('\t     ', function(result) {
        response = result;
        done();
      });
    });

    it('should translate to null', function(done) {
      expect(response).toBeNull();
      done();
    });
  });

  describe('translate word `translate`', function() {
    beforeEach(function(done) {
      translator.translate('translate', function(result) {
        response = result;
        done();
      });
    });

    it('should returns translation and phonetic', function(done) {
      expect(response).not.toBeNull();
      expect(response.translation).toContain('vt. 翻译；转化；解释；转变为；调动');
      expect(response.phonetic).toContain('træns\'leɪt');
      done();
    });
  });

  describe('translate phrase `good time`', function() {
    beforeEach(function(done) {
      translator.translate('good time', function(result) {
        response = result;
        done();
      });
    });

    it('should only returns translation', function(done) {
      expect(response).not.toBeNull();
      expect(response.translation).toContain('好时机；繁荣时期');
      expect(response.phonetic).not.toBeDefined();
      done();
    });
  });
});