(function() {
    var q = require('q');
    var RestrictAccess = require('./auth').authenticated;
    var Users = {};

    Users.properties = {
        tableName: "USERS",
        apiRoot: "/users",
        model: function(data) {
            this.id = "";
            this.fullName = "";
            this.surname = "";
            this.preferredName = "";
            this.postTitle = "";
            this.telInternal = "";
            this.telMobex = "";
            this.telExternal = "";
            this.emailAddress = "";
            this.profilePic = "";
            Users.properties._fillModel(this, data);
        },
        _fillModel: function(model, data, overwrite) {
            if (typeof data !== "undefined" && data) {
                if(typeof overwrite == "undefined") {
                    overwrite = true;
                }
                if ("fields" in data) {
                    if ("guid" in data) {
                        model.id = data.guid;
                        overwrite = false;
                    }
                    this._fillModel(model, data.fields, overwrite);
                } else {
                    console.log("overwrite is",overwrite);
                    for(var i in data) {
                        if (typeof model[i] !== 'undefined') {
                            if(i == "id") {
                                if(overwrite) {
                                    model[i] = data[i];
                                }
                            } else {
                                model[i] = data[i];
                            }
                        }
                    }
                }
            }
            return model;
        }
    };

    // curl -d "fullName=Morris%20Schmidt&&surname=Schmidt&&preferredName=Morris" http://127.0.0.1:8001/users
    // curl -d "fullName=Cassie%20Williams&&surname=Williams&&preferredName=Cassie" http://127.0.0.1:8001/users
    // curl -d "fullName=Jeffery%20Watson&&surname=Watson&&preferredName=Jeffery" http://127.0.0.1:8001/users
    // curl -d "fullName=Karla%20Gilliam&&surname=Gilliam&&preferredName=Karla" http://127.0.0.1:8001/users

    // everything's nicely packaged into a `Routes` object
    Users.routes = function(app) {
        // CREATE CRUD FOR USERS
        // app.get(Users.properties.apiRoot, RestrictAccess, function(req, res) {
        app.get(Users.properties.apiRoot, function(req, res) {
            this._listAll()
            .then(function(models) {
                return res.send(models);
            })
            .fail(function(err){
                return res.send(404, {error: err});
            });
        }.bind(this));

        this._listAll = function() {
            var deferred = q.defer();
            $fh.db({
                'act': 'list',
                'type': Users.properties.tableName,
            }, function(err, data) {
                if (err) {
                    console.log("Error in list",err);
                    // return res.send(404, {error: err});
                    deferred.reject(err);
                } else {
                    var models = [];
                    for (var i = 0; i < data.list.length; i++) {
                        var model = new Users.properties.model(data.list[i]);
                        models.push(model);
                    }
                    // return res.send(models);
                    deferred.resolve(models);
                }
            });
            return deferred.promise;
        };

        app.get(Users.properties.apiRoot+'/:id', function(req, res) {
            console.log("Get User with ID:",req.params.id);
            if(req.params.id !== null && 'number' != typeof req.params.id && (req.params.id.length != 12 && req.params.id.length != 24)) {
                return res.send(404, {error: "ID in incorrect format"});
            }
            $fh.db({
                'act': 'read',
                'type': Users.properties.tableName,
                'guid': req.params.id
            }, function(err, data) {
                if (err) {
                     console.log("Error in read",err);
                     return res.send(404, {error: err});
                } else {
                    if(!data.fields) {
                        return res.send(404, {error: "Model Not Found"});
                    }
                    return res.send( new Users.properties.model(data));
                }
            });
        }.bind(this));

        // curl -d "fullName=Tom%20Smith&&surname=Smith&&preferredName=Tom" http://127.0.0.1:8001/users
        app.post(Users.properties.apiRoot, function(req, res) {
            console.log("Create with params:",req.body);
            var model = new Users.properties.model(req.body);
            $fh.db({
                'act': 'create',
                'type': Users.properties.tableName,
                'fields': model
            }, function(err, data) {
                if (err) {
                    console.log("Error in create",err);
                    return res.send(500, {error: err});
                } else {
                    return res.send( new Users.properties.model(data) );
                }
            });
        });

        // curl -X PUT -d "telInternal=12345" http://127.0.0.1:8001/users/6611
        app.put(Users.properties.apiRoot+'/:id', function(req, res) {
            if(req.params.id !== null && 'number' != typeof req.params.id && (req.params.id.length != 12 && req.params.id.length != 24)) {
                return res.send(404, {error: "ID in incorrect format"});
            }
            $fh.db({
                'act': 'read',
                'type': Users.properties.tableName,
                'guid': req.params.id,
            }, function(err, data) {
                if (err) {
                    console.log("Error in update read",err);
                    return res.send(500, {error: err});
                } else {
                    if(!data.fields) {
                        return res.send(500, {error: "model not found"});
                    }
                    var model = Users.properties._fillModel(new Users.properties.model(data),req.body);
                    $fh.db({
                        'act': 'update',
                        'type': Users.properties.tableName,
                        'guid': model.id,
                        'fields': model
                    }, function(err, data) {
                        if (err) {
                            console.log("Error in update",err);
                            return res.send(500, {error: err});
                        } else {
                            return res.send( new Users.properties.model(data) );
                        }
                    });
                }
            });
        }.bind(this));

        // curl -X DELETE http://127.0.0.1:8001/users/<userid>
        app.delete(Users.properties.apiRoot+'/:id', function(req, res) {
            if(req.params.id !== null && 'number' != typeof req.params.id && (req.params.id.length != 12 && req.params.id.length != 24)) {
                return res.send(404, {error: "ID in incorrect format"});
            }
            $fh.db({
                'act': 'delete',
                'type': Users.properties.tableName,
                'guid': req.params.id,
            }, function(err, data) {
                if (err) {
                    console.log("Error in delete",err);
                    return res.send(500, {error: err});
                } else {
                    return res.send( new Users.properties.model(data) );
                }
            });
        }.bind(this));

    };

    module.exports = Users;
})();
