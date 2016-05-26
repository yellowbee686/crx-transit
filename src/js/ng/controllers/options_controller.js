import app from '../../config/application';
import angular from 'angular';

angular
  .module('TransitApp')
  .controller('OptionsCtrl', function($scope) {
    $scope.openExtensionPage = function() {
      app.openExtensionPage('options.html');
      window.close();
    };

    $scope.nextTranslator = function() {
      if ($scope.options.translator == 'baidu') {
        $scope.options.translator = 'youdao';
      } else {
        $scope.options.translator = 'baidu';
      }
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
