var app, background, openOrFocusOptionsPage;
background = chrome.extension.getBackgroundPage();
openOrFocusOptionsPage = function(event) {
  var height, left, optionsUrl, top, width;
  event.preventDefault();
  if (event.altKey) {
    width = 800;
    height = 600;
    left = screen.width / 2 - width / 2;
    top = screen.height / 2 - height / 2;
    chrome.windows.create({
      type: 'popup',
      width: width,
      height: height,
      left: left,
      top: top,
      url: 'jasmine/SpecRunner.html'
    });
    return false;
  }
  optionsUrl = chrome.extension.getURL('options.html');
  return chrome.tabs.query({}, function(extensionTabs) {
    var found, i;
    found = false;
    i = 0;
    while (i < extensionTabs.length) {
      if (optionsUrl === extensionTabs[i].url) {
        found = true;
        chrome.tabs.reload(extensionTabs[i].id);
        chrome.tabs.update(extensionTabs[i].id, {
          highlighted: true
        });
      }
      i++;
    }
    if (found === false) {
      chrome.tabs.create({
        url: 'options.html'
      });
    }
    return window.close();
  });
};
$('.btn-options').on('click', openOrFocusOptionsPage);
app = angular.module('TransitPopupApp', ['monospaced.elastic']);
app.directive('ngEnter', function() {
  return {
    link: function(scope, element, attrs) {
      return element.bind('keydown keypress', function(event) {
        if (event.which === 13) {
          event.preventDefault();
          return scope.$apply(function() {
            return scope.$eval(attrs.ngEnter, {
              event: event
            });
          });
        }
      });
    }
  };
});
app.filter('html_safe', function($sce) {
  return $sce.trustAsHtml;
});
app.controller('OptionsCtrl', function($scope, $timeout) {
  $scope.output = '';
  $scope.source = background.currentText;
  $scope.rows = 1;
  $scope.resetSource = function() {
    $scope.source = '';
    $scope.output = '';
    return background.currentText = '';
  };
  $scope.handleKeydown = function($event) {
    if ($event.keyCode === 27) {
      if (!$scope.source.isBlank()) {
        $event.stopPropagation();
        $event.preventDefault();
        return $scope.resetSource();
      }
    } else if ($event.keyCode === 13) {
      $event.stopPropagation();
      $event.preventDefault();
      if ($event.metaKey || $event.ctrlKey) {
        return document.execCommand('insertText', false, '\n');
      } else {
        return $scope.translate($scope.source);
      }
    }
  };
  $scope.handleChange = function($event) {
    if ($scope.source.isBlank()) {
      return $scope.resetSource();
    }
  };
  $scope.translate = function(source) {
    var message;
    if (source) {
      $scope.output = '<div class="loading">正在查询...</div>';
      message = {
        type: 'translate',
        text: source
      };
      return chrome.extension.sendMessage(message, function(response) {
        return $scope.$apply(function() {
          return $scope.output = response.translation;
        });
      });
    } else {
      return $scope.output = '';
    }
  };
  return initOptions(function() {
    var name, saveOptions;
    $scope.translate($scope.source);
    saveOptions = function() {
      return chrome.storage.sync.set($scope.options);
    };
    $scope.options = options;
    $scope.$apply();
    for (name in options) {
      $scope.$watch("options." + name, saveOptions);
    }
    return $timeout(function() {
      $scope.isReady = true;
      return angular.element('#source').focus().select();
    }, 200);
  });
});