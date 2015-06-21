var crxkit = require('../../lib/crxkit');

angular
  .module('TransitApp')
  .controller('OptionsCtrl', function($scope) {
    crxkit.initOptions(function() {
      $scope.options = crxkit.options;

      function saveOptions() {
        chrome.storage.sync.set($scope.options);
      }

      $scope.$apply();

      for (var name in crxkit.options) {
        $scope.$watch("options." + name, saveOptions);
      }
    });
  });
