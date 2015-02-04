var app = angular.module('TransitOptionsApp', []);
app.controller('OptionsCtrl', function($scope, $window) {
    initOptions(function() {
        $scope.options = options;
        $scope.$apply();

        function saveOptions() {
            chrome.storage.sync.set($scope.options);
        }

        for (var name in options) {
            $scope.$watch(fmt('options.#{1}', name), saveOptions);
        }
    });
});