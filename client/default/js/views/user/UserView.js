define([
    'underscore',
    'backbone',
    'models/UserModel',
    'text!templates/UserTemplate.html',
    'views/user/UserProfilePicView'
], function(_, Backbone, UserModel, UserTemplate, UserProfilePicView){

    var UserView = Backbone.View.extend({
        model: new UserModel(),

        initialize: function(options) {
            if(options.id) {
                this.model.set("id",options.id);
            }
            this.render = _.bind(this.render, this);
            this.model.bind('change', this.render);
            // this.render();

        },

        render: function() {
            App.HeaderView.model.set({title:this.model.get("fullName"),backBtn:true,editBtn:true});
            // Set `document` title to be the same as the Header title
            var compiledTemplate = _.template( UserTemplate, this.model.attributes );
            this.$el.html( compiledTemplate );
            var profilePic = new UserProfilePicView({model:this.model,el:this.$el.find('.profilePicture')});
            profilePic.render();
            return this;
        },

        onClose: function() {
            App.HeaderView.model.set({editBtn:false});
        },


    });

    return UserView;

});