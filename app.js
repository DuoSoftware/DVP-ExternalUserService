var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var session = require('express-session');

var cors = require('cors');
var app = express();

var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var externalUserService = require("./ExternalUserService");
var config = require('config');
var jwt = require('express-jwt');
var secret = require('dvp-common-lite/Authentication/Secret.js');
var authorization = require('dvp-common-lite/Authentication/Authorization.js');

var mongomodels = require('dvp-mongomodels');
var healthcheck = require('dvp-healthcheck/DBHealthChecker');

var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("[Unhandled Exception] Node Exiting...");
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error(err);
  console.log("[Unhandled Rejection] Node Exiting...");
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(errorhandler({ dumpExceptions: true, showStack: true }));
app.use(cors());

var hc = new healthcheck(app, {mongo: mongomodels.connection});
hc.Initiate();

app.post('/DVP/API/:version/BulkExternalUser',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.BulkCreate);
app.get('/DVP/API/:version/ExternalUsers',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUsers);
app.get('/DVP/API/:version/ExternalUsersByHint/:hint',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUsersByHint);
app.get('/DVP/API/:version/ExternalUsers/Count',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUsers);
app.get('/DVP/API/:version/ExternalUsersByTags',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUsersByTags);
app.get('/DVP/API/:version/ExternalUser/:id',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUser);
app.get('/DVP/API/:version/ExternalUser/:id/attribute/:attribute',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUserAttribute);
app.put('/DVP/API/:version/ExternalUser/:id/attribute/:attribute/value/:value',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserAttribute);

app.delete('/DVP/API/:version/ExternalUser/:id',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"delete"}), externalUserService.DeleteExternalUser);
app.post('/DVP/API/:version/ExternalUser',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.CreateExternalUser);
app.put('/DVP/API/:version/ExternalUser/:id',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUser);
app.get('/DVP/API/:version/ExternalUser/ByContact/:category/:contact',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUserProfileByContact);
app.get('/DVP/API/:version/ExternalUser/ByContactInteraction/:category/:contact',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUserProfileByInteraction);
app.get('/DVP/API/:version/ExternalUser/ByField/:field/:value',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUserProfileByField);
app.put('/DVP/API/:version/ExternalUser/:id/Contact/:contact',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserProfileContact);
app.put('/DVP/API/:version/ExternalUser/:id/Email/:email',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserProfileEmail);
app.delete('/DVP/API/:version/ExternalUser/:id/Contact/:contact',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"delete"}), externalUserService.RemoveExternalUserProfileContact);
app.put('/DVP/API/:version/ExternalUser/:id/Phone/:phone',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserProfilePhone);
app.get('/DVP/API/:version/ExternalUser/BySSN/:ssn',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.GetExternalUserProfileBySSN);
app.get('/DVP/API/:version/ExternalUser/Search/:text',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"read"}), externalUserService.SearchExternalUsers);
app.put('/DVP/API/:version/ExternalUser/:id/DynamicFields',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserProfileDynamicFields);
//app.delete('/DVP/API/:version/ExternalUser/:id/DynamicFields/:field',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateExternalUserProfileDynamicFields);
app.put('/DVP/API/:version/ExternalUser/:id/FormSubmission',jwt({secret: secret.Secret}), authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateFormSubmission);

app.get('/DVP/API/:version/ExternalUserConfig', jwt({secret: secret.Secret}),authorization({resource:"externalUser", action:"write"}), externalUserService.GetAccessibleFieldConfig);
app.put('/DVP/API/:version/ExternalUserConfig', jwt({secret: secret.Secret}),authorization({resource:"externalUser", action:"write"}), externalUserService.UpdateAccessibleFieldConfig);
app.post('/DVP/API/:version/ExternalUserConfig', jwt({secret: secret.Secret}),authorization({resource:"externalUser", action:"write"}), externalUserService.AddAccessibleFieldConfig);
app.get('/DVP/API/:version/ExternalUserConfig/DefaultKeys', jwt({secret: secret.Secret}),authorization({resource:"externalUser", action:"write"}), externalUserService.GetDefaultAccessibleFieldConfig);
app.get('/DVP/API/:version/ExternalUserConfig/UserFields', jwt({secret: secret.Secret}),authorization({resource:"externalUser", action:"write"}), externalUserService.GetUserFields);

app.listen(port, function () {
    logger.info("DVP-ExternalUserService.main Server listening at %d", port);
});


