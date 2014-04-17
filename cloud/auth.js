(function() {
    var crypto = require('crypto');
    var request = require('request');

    var Auth = {};

    var studioUrl = process.env.FH_MILLICORE || '<FH DOMAIN>';
    var appid = process.env.FH_INSTANCE || '<APP ID>';

    Auth.authenticated = function(req, res, next) {
        var cookies = req.cookies;
        // check if logged in
        $fh.session.get(cookies.sessionId, function(err, session){
            // if no `session` then not logged in or timed out
            if(!session) {
                return res.send(403, {error: "not authenticatd"});
            }
            next();
        });
    };

    Auth.routes = function(app) {
        // curl -d "username=hello&&password=everybody" http://127.0.0.1:8001/login
        // curl -d "username=<username>&&password=<password<" https://<cloudURL>/login
        app.post('/login', function(req, res) {
            console.log("URL IS",studioUrl);
            request.post({
                url: 'https://'+studioUrl+'/box/srv/1.1/admin/authpolicy/auth',
                body: '{"policyId":"Default","clientToken":"'+appid+'","device":"123","params":{"policyId":"Default","userId":"'+req.body.username+'","password":"'+req.body.password+'"}}'
            }, function(error, response, body){
                console.log("error",error);
                console.log("body",body);
                console.log("response",response);
                    if(JSON.parse(body).status == "ok") {
                        var userHash = crypto.createHash("md5").update(JSON.stringify(body)).digest("hex");
                        $fh.session.set(userHash, JSON.stringify(body), 18000, function(err, status){
                            console.log("session response",err,status);
                            return res.send(200, {sessionId: userHash});
                        });
                    } else {
                        return res.send(403, {error:"Login Incorrect"});
                    }
            });
        });

        // curl -b "sessionId=4a8ee19823cf210826277282eb2e601f" http://127.0.0.1:8001/users
        // curl -b "sessionId=4a8ee19823cf210826277282eb2e601f" http://127.0.0.1:8001/logout
        app.get('/logout', function(req, res) {
            var cookies = req.cookies;
            $fh.session.remove(cookies.sessionId, function(err, status){
                return res.send(200, {success: "logged out"});
            }.bind(this));
        });


    };

    module.exports = Auth;
})();












