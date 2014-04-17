// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'views/header/HeaderView',
    'views/navigation/NavigationView',
    'views/user/UserView',
    'views/user/UserCollectionView',
    'views/user/UserAddView',
    'views/form/FormPageView'
], function($, _, Backbone, Utils, HeaderView, NavigationView, UserView, UserCollectionView, UserAddView, FormPageView){
    var Router = Backbone.Router.extend({
        routes: {
            "users": "userCollectionRoute",
            "user/add": "addUserRoute",
            "user/edit": "editUserRoute",
            "user/:userid": "userRoute",
            "local": "localDocsRoute",
            "remote": "defaultRoute",
            "form": "formHomeRoute",
            "form/page/:pageid": "formRoute",
            "*actions": "defaultRoute"
        },

        initialize: function( options ) {
            this.appView = new Utils.appView();
            App.HeaderView = new HeaderView();
            App.NavigationView = new NavigationView();
            App.confirm = Utils.confirm;
        },

        userCollectionRoute: function() {
            console.log("User Collection Route");
            App.UserCollectionView = new UserCollectionView();
            this.appView.showView(App.UserCollectionView);
        },

        defaultRoute: function() {
            console.log("default route");
            App.Router.navigate('users',true);
        },

        addUserRoute: function() {
            App.UserAddView = new UserAddView({edit:false});
            this.appView.showView(App.UserAddView);
        },

        editUserRoute: function() {
            if(App.UserView) {
                App.UserAddView = new UserAddView({edit:true,model:App.UserView.model});
                this.appView.showView(App.UserAddView);
            } else {
                App.Router.navigate('users',true);
            }

        },

        formHomeRoute: function() {
            App.Router.navigate('form/page/1',true);
        },

        formRoute: function(pageid) {
            App.FormPageView = new FormPageView({page:pageid});
            this.appView.showView(App.FormPageView);
        },

        userRoute: function(userid) {
            console.log("User",userid,"selected");
            if(App.UserCollectionView) {
                var userModel = App.UserCollectionView.collection.get(userid);
                console.log("Direct form COllection");
                App.UserView = new UserView({model:userModel});
                this.appView.showView(App.UserView);
            } else {
                App.UserView = new UserView({id:userid});
                App.UserView.model.fetch();
                this.appView.showView(App.UserView);
            }
        }

    });

    return Router;
});