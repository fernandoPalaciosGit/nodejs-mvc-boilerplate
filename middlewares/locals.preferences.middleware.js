/**
 * local variables, session filetime : everiables shared by all middlewares, used in all templates
 */
module.exports = function () {
    'use strict';

    var LocalPathPreferences = function (serverpath) {
        this.path = {
            css: {
                'material-design-lite': '/bower_components/material-design-lite/material.min.css',
                'googleapis-material-icons': 'https://fonts.googleapis.com/icon?family=Material+Icons',
                'common-style': 'css/common.css'
            },
            js: {
                'material-design-lite': '/bower_components/material-design-lite/material.min.js',
                'npm-socketio': serverpath + '/socket.io/socket.io.js'
            }
        };
    };

    var LocalServerPreferences = function (serverpath) {
        this.environment = JSON.stringify(process.env);
        this.server = serverpath;
    };

    /**
     *
     * @property this.path.css all css path shared between views
     * @property this.path.js all js path shared between viewa
     * @property this.environment system environment paths
     * @property this.server root local server path
     */
    var LocalPreferences = function (req, res, next) {
        var serverpath = 'http://' + req.headers.host,
            preference = res.locals.preference = {};

        LocalServerPreferences.call(preference, serverpath);
        LocalPathPreferences.call(preference, serverpath);
        next();
    };

    this.expressServer.use(LocalPreferences);
};
