/*
 * TransIt Popup
 * 
 * jshint strict: true
 */

var angular = require('angular');

angular.module('TransitApp', ['monospaced.elastic']);

require('./ng/filters/html_safe_filter');
require('./ng/controllers/translate_controller');
require('./ng/controllers/options_controller');