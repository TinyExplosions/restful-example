define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    var AlertModel = Backbone.Model.extend({
        defaults : {
            title: "Some Title",
            content: "Some Placeholder Content",
            buttons: [
                {
                    label:'OK',
                    action: 'ok'
                }
            ]
        }
    });
    return AlertModel;
});


//if buttons.count > 2 or === 1, they are 100% wide, stacked on top
// if button count is 2, they are side by side, in order left, right
//action is what they'll call, if it's a function, that's what is returned