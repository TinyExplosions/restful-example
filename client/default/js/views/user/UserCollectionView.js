define([
    'underscore',
    'backbone',
    'collections/UserCollection',
    'text!templates/UserCollectionTemplate.html'
], function(_, Backbone, UserCollection, UserCollectionTemplate){

    var UserCollectionView = Backbone.View.extend({
        collection: new UserCollection(),

        initialize: function(options) {
            this.render = _.bind(this.render, this);
            this.collection.bind('change', this.render);
            // this.render();
            this.collection.fetch({
                success:function(){
                    console.log("Fetching Users");
                    this.render();
                }.bind(this)
            });
        },

        render: function() {
            console.log("Render");
            App.HeaderView.model.set({title:"List of Users",backBtn:false});
            // Set `document` title to be the same as the Header title
            var compiledTemplate = _.template( UserCollectionTemplate, {models:this.collection.models} );
            this.$el.html( compiledTemplate );
            return this;
        }

    });

    return UserCollectionView;

});