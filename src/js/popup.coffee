background = chrome.extension.getBackgroundPage()

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

app = angular.module('TransitPopupApp', ['monospaced.elastic'])

app.directive 'ngEnter', ->
  link: (scope, element, attrs) ->
    element.bind 'keydown keypress', (event) ->
      if event.which == 13
        event.preventDefault()
        scope.$apply ->
          scope.$eval attrs.ngEnter, event: event

app.filter 'html_safe', ($sce) ->
  return $sce.trustAsHtml

app.controller 'OptionsCtrl', ($scope, $timeout) ->
  $scope.output = ''
  $scope.source = background.currentText
  $scope.rows = 1

  $scope.resetSource = ->
    $scope.source = ''
    $scope.output = ''
    background.currentText = ''

  $scope.handleKeydown = ($event) ->
    if $event.keyCode == 27
      
      # 如果内容不为空，按下 ESC，会清空当前内容，否则，关闭窗口
      unless $scope.source.isBlank()
        $event.stopPropagation()
        $event.preventDefault()
        $scope.resetSource()

    else if $event.keyCode == 13
      $event.stopPropagation()
      $event.preventDefault()

      # 通过 Ctrl+Enter 或者 Cmd+Enter 进行换行
      # 如果仅按下 Enter，提交翻译
      if $event.metaKey || $event.ctrlKey
        document.execCommand('insertText', false, '\n');
      else
        $scope.translate($scope.source)

  $scope.handleChange = ($event) ->
    if $scope.source.isBlank()
      $scope.resetSource()

  $scope.translate = (source) ->
    if source
      $scope.output = '<div class="loading">正在查询...</div>'

      message = type: 'translate', text: source
      chrome.extension.sendMessage message, (response) ->
        $scope.$apply ->
          $scope.output = response.translation
    else
      $scope.output = ''

  initOptions ->
    $scope.translate($scope.source)

    saveOptions = ->
      chrome.storage.sync.set($scope.options)

    $scope.options = options
    $scope.$apply()

    for name of options
      $scope.$watch "options.#{name}", saveOptions

    # 这个延时是用于处理 OSX 的弹出窗口动画，该动画有时会导致窗口布局损坏 。
    $timeout ->
      $scope.isReady = true
      angular.element('#source').focus().select()
    , 200

