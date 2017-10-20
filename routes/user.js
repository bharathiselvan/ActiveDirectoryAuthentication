var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var activeDirectory = require('activedirectory');
var activeDirectoryConfig = require('../config');



router.post('/Authenticate', jsonParser, function (req, res) {
    if (!req.body) res.end(400);

    var userName = req.body.userName;
    var password = req.body.password;

    ValidateUser(userName, password, res);
})

function ValidateUser(username, password, res) {

    var config = {
        url: activeDirectoryConfig.ldapUrl,
        baseDN: activeDirectoryConfig.baseDN,
    };

    var ad = new activeDirectory(config);

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            res.send({ IsSuccess: 'false', ErrorCode: 101, ErrorDescription: err.name });            
            return;
        }
        else if (auth) {
            res.send({ IsSuccess: 'true', ErrorCode: 0, ErrorDescription: '' });
        }
        else {
            res.send({ IsSuccess: 'false', ErrorCode: 101, ErrorDescription: "Unknown Reason" });
        }
    })

}

module.exports = router;

