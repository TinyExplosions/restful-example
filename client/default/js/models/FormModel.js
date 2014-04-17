define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var HeaderModel = Backbone.Model.extend({
        // Default values.
        defaults : {
            formName: "Dynamic Risk Assessment",
            totalPages: "3",
            pages: [
                {
                    fields: [
                        {
                            type: 'input',
                            value: '',
                            label: 'Person Completing Form'
                        },
                        {
                            type: 'textarea',
                            value: '',
                            label: 'People Involved in Risk Assesment'
                        },
                        {
                            type: 'input',
                            value: '',
                            label: 'Objective'
                        },
                        {
                            type: 'dropdown',
                            value: '',
                            label: 'Groups Involved',
                            options: [
                                {
                                    value: 'staff',
                                    label: 'Staff'
                                },
                                {
                                    value: 'contractors',
                                    label: 'Contractors'
                                },
                                {
                                    value: 'passengers',
                                    label: 'Passengers'
                                },
                                {
                                    value: 'public',
                                    label: 'Public'
                                }
                            ]
                        }
                    ]
                },
                {
                    fields: [
                        {
                            type: 'textarea',
                            value: '',
                            label: 'People Involved in Risk Assesment'
                        },
                        {
                            type: 'input',
                            value: '',
                            label: 'Objective'
                        }
                    ]
                },
                {
                    fields: [
                        {
                            type: 'dropdown',
                            value: '',
                            label: 'Groups Involved',
                            options: [
                                {
                                    value: 'staff',
                                    label: 'Staff'
                                },
                                {
                                    value: 'contractors',
                                    label: 'Contractors'
                                },
                                {
                                    value: 'passengers',
                                    label: 'Passengers'
                                },
                                {
                                    value: 'public',
                                    label: 'Public'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });
    return HeaderModel;
});