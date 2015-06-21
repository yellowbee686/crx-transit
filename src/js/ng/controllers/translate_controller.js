var background = chrome.extension.getBackgroundPage();

angular
  .module('TransitApp')
  .controller('TranslateCtrl', function($scope) {
    $scope.source = '';
    $scope.output = '';

    $scope.resetSource = function() {
      $scope.source = ''
      $scope.output = ''
      background.currentText = ''
    };

    $scope.translate = function(source) {
      $scope.source = source.trim();
      $scope.output = '翻译结果: <strong>[{1}]</strong>'.assign(source);
    };

    $scope.translate = function(source) {
      $scope.source = source.trim();

      if ($scope.source) {
        $scope.output = '<div class="loading">正在查询...</div>';

        var message = { type: 'translate', text: $scope.source };
        chrome.extension.sendMessage(message, function(response) {
          $scope.$apply(function() {
            $scope.output = response.translation;
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
        }
      }
    };

    $scope.handleChange = function($event) {
      if ($scope.source.isBlank()) {
        return $scope.resetSource();
      }
    };
  });
