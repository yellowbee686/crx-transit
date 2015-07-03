var angular = require('angular');

angular
  .module('TransitApp', [])
  .filter('html_safe', function($sce) {
    return $sce.trustAsHtml;
  });

module.exports = 'ngHtmlSafeFilter';