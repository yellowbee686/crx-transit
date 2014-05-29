var app = chrome.extension.getBackgroundPage(),
    $source = $('#source'),
    $result = $('#result');

function translate(text) {
    if (!text) return;

    chrome.extension.sendMessage({ type: 'translate', text: text }, 
        function(response) {
            $result.html(response.translation);
        }
    );
}

function transit(evt) {
    var text = $source.val().trim();

    if (evt.keyCode != 13) return;

    translate(text);

    return false;
}

$source.on('keypress', transit);
$source.focus();
$source.val(app.currentText);
translate(app.currentText);

var app = angular.module('TransitPopupApp', []);
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