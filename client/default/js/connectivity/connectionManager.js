define( [
    'jquery',
    'machina',
    'underscore'
], function ($, machina, _) {
    var useStethoscope = function (fsm, steth) {
        _.each( ['heartbeat', 'no-heartbeat'], function (eventName) {
            steth.on(eventName, function () {
                fsm.handle(eventName);
            });
        });
    };
    return machina.Fsm.extend( {
        namespace : 'connectionManager',
        initialState : "offline",

        initialize: function() {
            var self = this;
            $(window).bind("online", function () {
                self.handle("window.online");
            });
            $(window).bind("offline", function () {
                self.handle("window.offline");
            });
            $(window.applicationCache).bind("error", function () {
                self.handle("appCache.error");
            });
            $(window.applicationCache).bind("downloading", function () {
                self.handle("appCache.downloading");
            });
            $(document).on("resume", function () {
                self.handle("device.resume");
            });
        },
        
        states : {
            probing : {
                _onEnter : function () {
                    if ( !this.wiredUp ) {
                        useStethoscope( this, this.stethoscope );
                        this.wiredUp = true;
                    }
                    this.stethoscope.checkHeartbeat();
                },
                "heartbeat" : "online",
                "no-heartbeat" : "disconnected",
                "go.offline" : "offline",
                "*" : function () {
                    this.deferUntilTransition();
                }
            },

            online : {
                "window.offline"  : "probing",
                "appCache.error"  : "probing",
                "request.timeout" : "probing",
                "device.resume"   : "probing",
                "go.offline"      : "offline"
            },

            disconnected : {
                "window.online"        : "probing",
                "appCache.downloading" : "probing",
                "go.online"            : "probing",
                "device.resume"        : "probing",
                "go.offline"           : "offline"
            },

            offline : {
                "go.online" : "probing"
            }
        },

        // wrapper functions to allow App.httpConnectivity.goOnline(); and App.httpConnectivity.goOffline();
        // as convienience functions.
        goOnline: function() {
            this.handle('go.online');
        },
        goOffline: function() {
            this.handle('go.offline');
        }
    });
});