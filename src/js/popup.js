/*
 * TransIt Popup
 * 
 * jshint strict: true
 */

var angular = require('angular');
var elastic = require('angular-elastic');

angular.module('TransitApp', ['monospaced.elastic']);

require('./ng/filters/html_safe_filter');
require('./ng/controllers/translate_controller');
require('./ng/controllers/options_controller');