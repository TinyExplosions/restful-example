define([
    'underscore',
    'backbone',
    'models/AlertModel',
    'text!templates/AlertTemplate.html'
], function(_, Backbone, AlertModel, AlertTemplate){

    var AlertView = Backbone.View.extend({
        className: "alertWrapper",

        model: new AlertModel(),

        initialize: function(opts) {
            $('.alertWrapper').remove();
            // App.showLoadMask();
            this.render();
        },

        events: {
            'click a': 'linkTapped',
        },

        render: function() {
            var compiledTemplate = _.template( AlertTemplate, this.model.attributes );
            this.$el.html( compiledTemplate );
            // App.hideLoadMask();

            return this;
        },

        linkTapped: function(evt) {
            if(evt.target.className == "close") {
                if(this.model.get('cancel')) {
                   this.model.get('cancel')();
                }
            }
            if(evt.target.className == "ok") {
                if(this.model.get('success')) {
                   this.model.get('success')();
                }
            }
            return this.close(evt);
        },

        show: function() {
            $('body').prepend(this.$el);
            this.$el.find('.appAlert').css("height",this.$el.find('.appAlert').outerHeight());
            this.$el.find('.appAlert').css("margin-top","-"+(this.$el.find('.appAlert').outerHeight()/2)+"px");
            this.$el.find('.appAlert').css("margin-left","-"+(this.$el.find('.appAlert').outerWidth()/2)+"px");
            this.$el.show();
            return this;
        },

        close: function(evt) {
            this.$el.remove();

            return this;
        }


    });
    return AlertView;
});