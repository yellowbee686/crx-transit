/*
 * TransIt Options
 * 
 * jshint strict: true
 */

var angular = require('angular');

angular.module('TransitApp', []).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    //scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    var files = changeEvent.target.files;
                    scope.fileread = files;
                    // var names = [];
                    // for(var i=0;i<files.length;i++){
                    //     names[i] = files[i].name;
                    // }
                    // scope.fileread = names;
                });
            });
        }
    }
}]);

require('./ng/controllers/options_controller');
