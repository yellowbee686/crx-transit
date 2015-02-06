openOrFocusOptionsPage = (event) ->
  event.preventDefault()

  if event.altKey
    width = 800
    height = 600
    left = screen.width / 2 - width / 2
    top = screen.height / 2 - height / 2
    chrome.windows.create
      type: 'popup'
      width: width
      height: height
      left: left
      top: top
      url: 'jasmine/SpecRunner.html'
    return false

  optionsUrl = chrome.extension.getURL('options.html')
  chrome.tabs.query {}, (extensionTabs) ->
    found = false
    i = 0
    while i < extensionTabs.length
      if optionsUrl == extensionTabs[i].url
        found = true
        chrome.tabs.reload extensionTabs[i].id
        chrome.tabs.update extensionTabs[i].id, highlighted: true
      i++
    if found == false
      chrome.tabs.create url: 'options.html'
    window.close()

$('.btn-options').on 'click', openOrFocusOptionsPage

app = angular.module('TransitPopupApp', [])

app.directive 'ngEnter', ->
  link: (scope, element, attrs) ->
    element.bind 'keydown keypress', (event) ->
      if event.which == 13
        event.preventDefault()
        scope.$apply ->
          scope.$eval attrs.ngEnter, event: event

app.filter 'html_safe', ($sce) ->
  return $sce.trustAsHtml

app.controller 'OptionsCtrl', ($scope) ->
  $scope.output = ''
  $scope.source = chrome.extension.getBackgroundPage().currentText

  $scope.translate = (source) ->
    $scope.output = '正在查询...'
    #$scope.$apply()

    message = type: 'translate', text: source
    chrome.extension.sendMessage message, (response) ->
      $scope.$apply ->
        $scope.output = response.translation

  initOptions ->
    $scope.translate($scope.source)

    saveOptions = ->
      chrome.storage.sync.set($scope.options)

    $scope.options = options
    $scope.$apply()

    for name of options
      $scope.$watch "options.#{name}", saveOptions

