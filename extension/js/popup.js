var app = chrome.extension.getBackgroundPage(),
    $source = $('#source'),
    $result = $('#result');

function translate(text) {
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

function openOrFocusOptionsPage() {
   var optionsUrl = chrome.extension.getURL('options.html'); 
   chrome.tabs.query({}, function(extensionTabs) {
      var found = false;
      for (var i=0; i < extensionTabs.length; i++) {
         if (optionsUrl == extensionTabs[i].url) {
            found = true;
            chrome.tabs.reload(extensionTabs[i].id);
            chrome.tabs.update(extensionTabs[i].id, {highlighted: true});
         }
      }
      if (found == false) {
          chrome.tabs.create({url: "options.html"});
      }

      window.close();
   });

}

function reset_source() {
  if (this.value) return;

  $result.empty();
  translate('');
}

$source.on('keypress', transit);
$source.on('input', reset_source);
$source.focus();
$source.val(app.currentText);
$source.get(0).select();
$('.btn-options').on('click', openOrFocusOptionsPage);

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