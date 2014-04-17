define([
    'underscore',
    'backbone',
    'utils',
    'models/UserModel'
], function( _, Backbone, Utils, UserModel ) {

    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        initialize : function() {
            this.url = Utils.getRoot()+"/users";
        }
    });

    return UserCollection;
});