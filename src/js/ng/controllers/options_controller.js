import app from '../../config/application';
import angular from 'angular';
//import MCommon from '../../lib/mdict_js/mdict-common'
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

      $scope.$apply();

      for (var name in app.options) {
        $scope.$watch("options." + name, saveOptions);
      }

      function initParser(){
        //初始化mdict
        var fileNames = $scope.dictfiles;
        if(fileNames && fileNames.length>0){
          MParser(fileNames).then(function(resources) {
              app.mdict = MRenderer(resources);
          });
          app.doSearch = function(phrase, offset, callback) {
              console.log(phrase + '');
              this.mdict.search(phrase, offset).then(function(content) {
                //$('#definition').empty().append($content.contents());
                callback(content);
                console.log('--');
              });
          };
        }
      }

      $scope.$watch("dictfiles", initParser);
    });
  });
