define([
    'underscore',
    'backbone',
    'models/FormModel',
    'text!templates/FormTemplate.html'
], function(_, Backbone, FormModel, FormTemplate){

    var FormPageView = Backbone.View.extend({
        model: new FormModel(),

        initialize: function(options) {
            this.model.set({currPage:options.page});
            this.render = _.bind(this.render, this);
            // this.model.bind('change:title', this.render);
        },

        events: {
            'click button.advance': 'advance'
        },

        render: function() {
            // Set `document` title to be the same as the Header title
            var currPage = parseInt(this.model.get("currPage"));
            currPage --;
            var formPage = this.model.get("pages")[currPage];
            formPage.currPage = parseInt(this.model.get("currPage"));
            formPage.totalPages = parseInt(this.model.get("totalPages"));
            console.log("render form");
            var compiledTemplate = _.template( FormTemplate, formPage );
            this.$el.html( compiledTemplate );
            return this;
        },

        advance: function(evt) {
            var currPage = parseInt(this.model.get("currPage"));
            var nextPage = currPage+1;
            App.Router.navigate('form/page/'+nextPage,true);
            // var currPage = parseInt(this.model.get("currPage"));
            // if (currPage++ <= parseInt(this.model.get("totalPages"))) {
            //     // this.model.validate();
            //     App.Router.navigate('form/page/'+currPage++,true);
            // } else {
            //     this.submitForm();
            // }
        },

        submitForm: function(evt) {
            this.model.save();
            // stuff
        }

    });

    return FormPageView;

});