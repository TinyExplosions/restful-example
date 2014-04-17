//  Really simple heartbeat function used to test connectivity
exports.heartbeat = function(params, callback) {
    return callback(null,{heartbeat:"success"});
};