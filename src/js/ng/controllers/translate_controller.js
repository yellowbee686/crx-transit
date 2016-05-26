import sugar from 'sugar';
import app from '../../config/application';
import { renderTranslation } from '../../lib/utils';

angular
  .module('TransitApp')
  .controller('TranslateCtrl', function($scope, $timeout) {
    $scope.source = '';
    $scope.output = '';


    $scope.resetSource = function() {
      $scope.source = '';
      $scope.output = '';
    };

    $scope.translate = function(source) {
      $scope.source = (source || '').trim();

      if ($scope.source) {
        $scope.output = '<div class="loading">正在查询...</div>';

        var message = { type: 'translate', text: $scope.source };
        chrome.extension.sendMessage(message, function(response) {
          app.log("Translate:", response);
          $scope.$apply(function() {
            $scope.output = renderTranslation($scope.source, response);
          });
        });
      } else {
        $scope.output = '';
      }
    };

    $scope.handleKeydown = function($event) {
      // 如果内容不为空，按下 ESC，会清空当前内容，否则，关闭窗口
      if ($event.keyCode === 27) {
        if (!$scope.source.isBlank()) {
          $event.stopPropagation();
          $event.preventDefault();
          $scope.resetSource();
        }
      } else if ($event.keyCode === 13) {
        $event.stopPropagation();
        $event.preventDefault();

        // 通过 Ctrl+Enter 或者 Cmd+Enter 进行换行
        // 如果仅按下 Enter，提交翻译
        if ($event.metaKey || $event.ctrlKey) {
          document.execCommand('insertText', false, '\n');
        } else {
          $scope.translate($scope.source);
          
          chrome.runtime.sendMessage({ type: 'selection', text: $scope.source });
        }
      }
    };

    $scope.handleChange = function($event) {
      if ($scope.source.isBlank()) {
        return $scope.resetSource();
      }
    };

    chrome.runtime.sendMessage({ type: 'currentText' }, (text) => {
      $scope.translate(text);

      $timeout(function() {
        var source = document.querySelector('#source');
        source.focus();
        source.select();
      }, 500);
    });
  });
