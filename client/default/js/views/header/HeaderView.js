define([
    'underscore',
    'backbone',
    'models/HeaderModel',
    'text!templates/HeaderTemplate.html'
], function(_, Backbone, HeaderModel, HeaderTemplate){

    var HeaderView = Backbone.View.extend({
        el: $("header"),
        model: new HeaderModel(),

        initialize: function(options) {
            this.render = _.bind(this.render, this);
            this.model.bind('change:title', this.render);
            this.render();
        },

        events: {
            'click a.goBack': 'goBack',
            'click a.addUser': 'addUser',
            'click a.editUser': 'editUser',
            'click a.toggleMenu': 'toggleMenu'
        },

        render: function() {
            // Set `document` title to be the same as the Header title
            document.title = this.model.get("title");
            var compiledTemplate = _.template( HeaderTemplate, this.model.attributes );
            this.$el.html( compiledTemplate );
            return this;
        },

        goBack: function(evt) {
            App.back = true;
            window.history.back();
        },

        addUser: function(evt) {
            App.Router.navigate('user/add',true);
        },

        editUser: function(evt) {
            App.Router.navigate('user/edit',true);
        },

        toggleMenu: function(evt) {
            if($(".wrapper").hasClass("open")) {
                $(".wrapper").attr("class","wrapper transition");
            } else {
                $(".wrapper").attr("class","wrapper transition open");
            }
        }

    });

    return HeaderView;

});