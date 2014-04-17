define([
    'underscore',
    'backbone',
    'models/UserModel',
    'text!templates/UserProfilePic.html'
], function(_, Backbone, UserModel, UserProfilePicTemplate){

    var UserProfilePicView = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
            this.render = _.bind(this.render, this);
            this.model.bind('change:profilePic', this.render);
        },
        render: function() {
            var compiledTemplate = _.template( UserProfilePicTemplate, this.model.attributes );
            this.$el.html( compiledTemplate );
            return this;
        }
    });

    return UserProfilePicView;

});