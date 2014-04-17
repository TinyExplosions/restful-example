define([
    'underscore',
    'backbone',
    'text!templates/NavigationTemplate.html'
], function(_, Backbone, NavigationTemplate){

    var NavigationView = Backbone.View.extend({
        el: $(".navigation"),

        initialize: function(options) {
            this.render = _.bind(this.render, this);
            // this.model.bind('change:title', this.render);
            this.render();
        },

        events: {
        },

        render: function() {
            // Set `document` title to be the same as the Header title
            var compiledTemplate = _.template( NavigationTemplate, {} );
            this.$el.html( compiledTemplate );
            return this;
        }

    });

    return NavigationView;

});