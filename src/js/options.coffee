app = angular.module('TransitOptionsApp', [])
app.controller 'OptionsCtrl', ($scope, $window) ->
  initOptions ->
    $scope.options = options
    $scope.$apply()

    saveOptions = ->
      chrome.storage.sync.set($scope.options)

    for name of options
      $scope.$watch("options.#{name}", saveOptions)
