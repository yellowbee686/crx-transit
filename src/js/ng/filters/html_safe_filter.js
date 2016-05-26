import angular from 'angular';

angular
  .module('TransitApp')
  .filter('html_safe', function($sce) {
    return $sce.trustAsHtml;
  });