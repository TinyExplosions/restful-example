define([
    'underscore',
    'backbone',
    'utils'
], function(_, Backbone, Utils) {
    var UserModel = Backbone.Model.extend({
        // Default values.
        defaults : {
            fullName: "",
            surname: "",
            preferredName: "",
            postTitle: "",
            telInternal: "",
            telMobex: "",
            telExternal: "",
            emailAddress: "",
            profilePic: ""
        },
        initialize: function() {
            this.urlRoot = Utils.getRoot()+"/users";
        }
    });
    return UserModel;
});