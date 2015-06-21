(function() {

  window.crx = function() {
    var crx = this;

    function extend(hashA, hashB) {
      hashA = hashA || {};

      for (var k in hashB) {
        hashA[k] = hashB[k];
      }

      return hashA;
    }

    crx.delegateOptions = function(options, settings) {
      var settings = extend({ area: 'sync', name: 'options' }, settings);
      var storage = chrome.storage[settings.area];

      function saveOptions(options) {
        var toSave = {};
        toSave[settings.field] = options;
        storage.set(toSave);
      }

      storage.get(settings.field, function(data) {
        extend(options, data);
        saveOptions(options);
      });

      chrome.storage.onChanged.addListener(function(changes) {
        if (settings.field in changes) {
          extend(changes, changes[settings.field].newValue);
        }
      });

      Object.observe(options, function() {
        saveOptions(options);
      });
    };

  }();

})();