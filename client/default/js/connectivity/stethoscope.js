define( [
    'backbone',
    'jquery'
], function ( Backbone, $ ) {

    var Stethoscope = function ( heartbeatDef ) {
        this.settings = $.extend( {
            type : "GET",
            dataType : "json",
            timeout : 5000
        }, heartbeatDef );
    };

    $.extend( Stethoscope.prototype, Backbone.Events, {
        checkHeartbeat : function () {
            var self = this;
            self.trigger( 'checking-heartbeat' );
            $fh.act({
                act: "heartbeat",
                req: {}
            }, function(res){
                self.trigger( 'heartbeat' );
            }, function(err){
                self.trigger( 'no-heartbeat' );
            });
        }
    } );

    return Stethoscope;
} );