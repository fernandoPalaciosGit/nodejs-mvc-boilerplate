/**
 * serve favicon for improve request
 */
;(function () {
    'use strict';
    
    var favicon = require('serve-favicon'),
        path = require('path');

    module.exports = favicon(path.join(__dirname + './../static/favicon.ico'));
}());