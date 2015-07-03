var app = require('../../config/application');
var angular = require('angular');
var crxkit = require('../../lib/crxkit');

angular
  .module('TransitApp')
  .controller('OptionsCtrl', function($scope) {
    $scope.openExtensionPage = function() {
      crxkit.openExtensionPage('options.html');
      window.close();
    };

    app.initOptions(function() {
      $scope.options = app.options;
      app.log('Options Loaded:', app.options);

      function saveOptions() {
        chrome.storage.sync.set($scope.options);
      }

      $scope.$apply();

      for (var name in app.options) {
        $scope.$watch("options." + name, saveOptions);
      }
    });
  });
