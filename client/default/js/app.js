// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router', // Request router.js
    'connectivity/connectionManager',
    'connectivity/stethoscope',
    'utils'
], function($, _, Backbone, Router, ConnectionManager, Stethoscope, Utils){
    var stethoscope = new Stethoscope();
    var initialize = function(){
        App.vent = new _.extend({}, Backbone.Events);
        Utils.initialize();
        App.Connection = new ConnectionManager({
            stethoscope: stethoscope
        });
        App.Connection.on("transition", function(data) {
            App.vent.trigger("connection:transition", data);
        });
        // Attempt to go online
        App.Connection.goOnline();
        App.Router = new Router();
        Backbone.history.start();
    };

    return {
        initialize: initialize,
    };


});

