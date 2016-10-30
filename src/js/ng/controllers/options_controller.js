import app from '../../config/application';
import angular from 'angular';
import MParser from '../../lib/mdict_js/mdict-parser';
//import MRenderer from '../../lib/mdict_js/mdict-renderer';
import Promise from '../../lib/bluebird.min';

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
      $scope.resources = [];
      $scope.$apply();
      for (var name in app.options) {
        $scope.$watch("options." + name, saveOptions);
      }

      function initParser(){
        //初始化mdict
        var fileNames = $scope.dictfiles;
        if(fileNames && fileNames.length>0){
          MParser(fileNames).then(function(resources) {
              //var mdict = MRenderer(resources);
              //Object.merge($scope.mdict, mdict);
              //Object.merge($scope.resources, resources);
              $scope.resources = [];
              for(var i=0;i<resources.length;i++){
                $scope.resources.push(resources[i]);
              }
          });
        }
      }

      $scope.$watch("dictfiles", initParser);

      function search(query, i) {
        return $scope.resources[i].then(function(lookup) {
          return lookup(query);
        });
      }

      function doSearchHandler(message, sender, sendResponse){
        if(message.text){
          // if($scope.mdict.search){
          //   $scope.mdict.search(message.text).then(function(content) {
          //     sendResponse(content);
          //     console.log('--');
          //   });
          // }
          //doSearchHandler会被调用两次，第一次时$scope不正确 因此length为0 因此else中不能回调，否则不会有第二次调用了
          if($scope.resources.length>0){
            var results = [];
            Promise.mapSeries($scope.resources, function(item, index, length){
              return Promise.resolve(item(message.text).then(function(content){
                var title = $scope.dictfiles[index].name;
                results.push({title: title, content: content});
              }));
            }).then(function(){
              sendResponse(results);
            })
          } else {
            console.log('nothing found');
            //sendResponse('');
          }
        }
      }

      app.registerMessageDispatcher({
        searchSanskrit: doSearchHandler
      });
    });
  });
