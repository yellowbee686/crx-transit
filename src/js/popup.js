var $          = require('jquery');

angular.module('TransitApp', ['monospaced.elastic']);

require('./ng/filters/html_safe_filter');
require('./ng/controllers/translate_controller');
require('./ng/controllers/options_controller');

// app.filter('html_safe', function($sce) {
//   return $sce.trustAsHtml;
// });

// app.controller('OptionsCtrl', function($scope, $timeout) {
//   $scope.output = '';
//   $scope.source = background.currentText;
//   $scope.rows = 1;

//   $scope.resetSource = function() {
//     $scope.source = '';
//     $scope.output = '';
//     background.currentText = '';
//   };

//   $scope.handleKeydown = function($event) {
//     if ($event.keyCode === 27) {
//       if (!$scope.source.isBlank()) {
//         $event.stopPropagation();
//         $event.preventDefault();
//         $scope.resetSource();
//       }
//     } else if ($event.keyCode === 13) {
//       $event.stopPropagation();
//       $event.preventDefault();
//       if ($event.metaKey || $event.ctrlKey) {
//         return document.execCommand('insertText', false, '\n');
//       } else {
//         return $scope.translate($scope.source);
//       }
//     }
//   };

//   $scope.handleChange = function($event) {
//     if ($scope.source.isBlank()) {
//       return $scope.resetSource();
//     }
//   };

//   $scope.translate = function(source) {
//     var message;
//     if (source) {
//       $scope.output = '<div class="loading">正在查询...</div>';
//       message = {
//         type: 'translate',
//         text: source
//       };
//       return chrome.extension.sendMessage(message, function(response) {
//         return $scope.$apply(function() {
//           return $scope.output = response.translation;
//         });
//       });
//     } else {
//       return $scope.output = '';
//     }
//   };

//   crxkit.initOptions(function() {
//     var name, saveOptions;
//     $scope.translate($scope.source);
//     saveOptions = function() {
//       return chrome.storage.sync.set($scope.options);
//     };
//     $scope.options = options;
//     $scope.$apply();
//     for (name in options) {
//       $scope.$watch("options." + name, saveOptions);
//     }
//     return $timeout(function() {
//       $scope.isReady = true;
//       return angular.element('#source').focus().select();
//     }, 200);
//   });
// });