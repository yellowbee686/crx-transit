import app from '../../config/application';
import angular from 'angular';
import MParser from '../../lib/mdict_js/mdict-parser';
import MRenderer from '../../lib/mdict_js/mdict-renderer';

angular
  .module('TransitApp')
  .controller('OptionsCtrl', function($scope) {
    $scope.openExtensionPage = function() {
      app.openExtensionPage('options.html');
      window.close();
    };

    $scope.nextTranslator = function() {
      const translators = ['baidu', 'youdao', 'bing', 'sanskrit'];
      
      let index = translators.indexOf($scope.options.translator) + 1;
      $scope.options.translator = translators[index % translators.length];
    };

    app.initOptions(function() {
      $scope.options = app.options;
      app.log('Options Loaded:', app.options);

      function saveOptions() {
        chrome.storage.sync.set($scope.options);
      }
      $scope.mdict = {};
      $scope.$apply();
      for (var name in app.options) {
        $scope.$watch("options." + name, saveOptions);
      }

      function initParser(){
        //初始化mdict
        var fileNames = $scope.dictfiles;
        if(fileNames && fileNames.length>0){
          MParser(fileNames).then(function(resources) {
              var mdict = MRenderer(resources);
              Object.merge($scope.mdict, mdict);
          });
        }
      }

      $scope.$watch("dictfiles", initParser);

      function doSearchHandler(message, sender, sendResponse){
        if(message.text && $scope.mdict.search){
          var offset = 0;
          $scope.mdict.search(message.text, offset).then(function(content) {
            sendResponse(content);
            console.log('--');
          });
        }
      }

      app.registerMessageDispatcher({
        searchSanskrit: doSearchHandler
      });
    });
  });
