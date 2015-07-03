/*
 * TransIt Popup
 * 
 * jshint strict: true
 */

var $ = require('jquery');
var crxkit = require('./lib/crxkit');

console.log($);

angular.module('TransitApp', ['monospaced.elastic']);

require('./ng/filters/html_safe_filter');
require('./ng/controllers/translate_controller');
require('./ng/controllers/options_controller');

$('.btn-options').click(function() {
  crxkit.openExtensionPage('options.html');
});