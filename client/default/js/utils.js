// Filename: utils.js
define([
    'jquery',
    'backbone',
    'models/AlertModel',
    'views/alert/AlertView',
], function( $,Backbone,AlertModel,AlertView){

    var initialize = function(options) {
        App.vent.bind("connection:transition", _transition, this);
    };

    var getRoot = function() {
        // figure out the root for calls to the REST API (instead of using $fh.act)
        var cloud_host = $fh.cloud_props.hosts.releaseCloudUrl;
        if ( $fh.app_props.mode && $fh.app_props.mode.indexOf("dev") > -1 ) {
            cloud_host = $fh.cloud_props.hosts.debugCloudUrl;
        }
        return cloud_host;
    };

    window.alert = function(opts) {
        console.log("new alert");
        if (typeof opts == 'string') {
            var model = new AlertModel({
                content: opts,
                buttons: [{
                    label: 'OK',
                    action: 'close'
                }]
            });
            return new AlertView({
                model: model
            }).show();
        }
        return new AlertView(opts).show();
    };

    var confirm = function(test,ok,cancel) {
        var model = new AlertModel({
            content: test,
            buttons: [{
                label: 'Yes',
                action: 'ok'
            },{
                label: 'No',
                action: 'close'
            }],
            success: ok,
            cancel: cancel
        });
        return new AlertView({
            model: model
        }).show();
    }

    var appView = function() {
        this.showView = function( view ) {
            // if (this.currentView){
            //     if(this.currentView.onClose) {
            //         this.currentView.onClose();
            //     }
            //     this.currentView.remove();
            // }
            this.currentView = view;
            this.currentView.render();
            $(".wrapper").attr("class","wrapper transition");

            slidePage(this.currentView);
            // $(".content").html(this.currentView.el);
        };
    };

    slidePage = function(page) {
        var slideFrom = "";
        var self = this;

        if (!this.currentPage) {
            $(".content").empty();
            // If there is no current page (app just started) -> No transition: Position new page in the view port
            $(page.el).attr('class', 'page stage-center');
            $('.content').append(page.el);
            this.currentPage = page;
            return;
        }
        // Cleaning up: remove old pages that were moved out of the viewport
        $('.page.stage-right, .page.stage-left').remove();

        if (App.back || App.ReverseTransition) {
            // The new page is the same as the previous page -> Back transition
            slideFrom = "left";
            $(page.el).attr('class', 'page stage-left');
            App.back = false;
        } else {
            // Forward transition (slide from right)
            slideFrom = "right";
            $(page.el).attr('class', 'page stage-right');
        }
        App.ReverseTransition = false;

        $('.content').append(page.el);
        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            $(this.currentPage.el).attr('class', 'page');
            // // Have to remove IScroll's inline styles from the page first to allow it so slide out the way.
            // $(this.currentPage.el).attr('style', '');
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(this.currentPage.el).attr('class', 'page transition ' + (slideFrom === "right" ? 'stage-left' : 'stage-right'));

            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            this.lastPage = this.currentPage;
            if (this.lastPage.onClose && this.lastPage != page) {
                this.lastPage.onClose();
            }
            // this.lastPage.remove();
            this.currentPage = page;
        }.bind(this));
    };

    var _transition = function(data) {
        console.log("TRANSITIONING",data);
        $(".something").remove();
        $("body").before("<div class='something "+App.Connection.state+"'>App is "+App.Connection.state+"</div>");
        // if (data.toState === "online") {
        //     this.pollTravelAlert();
        // }
    };

    return {
        initialize: initialize,
        getRoot: getRoot,
        appView: appView,
        confirm: confirm
    };
});
