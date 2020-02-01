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
var jwt = require('restify-jwt');
var secret = require('dvp-common-lite/Authentication/Secret.js');
var authorization = require('dvp-common-lite/Authentication/Authorization.js');

var mongomodels = require('dvp-mongomodels');

var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(errorhandler({ dumpExceptions: true, showStack: true }));
app.use(cors());

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


























/*


 var server = restify.createServer({
 name: "DVP User Service"
 });

 server.pre(restify.pre.userAgentConnection());
 server.use(restify.bodyParser({ mapParams: false }));
 restify.CORS.ALLOW_HEADERS.push('authorization');
 server.use(restify.CORS());
 server.use(restify.fullResponse());
 server.use(jwt({secret: secret.Secret}));


 //////////////////////////////Cloud API/////////////////////////////////////////////////////

 server.get('/DVP/API/:version/Users', authorization({resource:"user", action:"read"}), userService.GetUsers);
 server.get('/DVP/API/:version/User/:name', authorization({resource:"user", action:"read"}), userService.GetUser);
 server.del('/DVP/API/:version/User/:name', authorization({resource:"user", action:"delete"}), userService.DeleteUser);
 server.post('/DVP/API/:version/User', authorization({resource:"user", action:"write"}), userService.CreateUser);
 server.put('/DVP/API/:version/User/:name', authorization({resource:"user", action:"write"}), userService.UpdateUser);

 //////////////////////////////Organisation API/////////////////////////////////////////////////////
 server.get('/DVP/API/:version/User/:name/profile', authorization({resource:"userProfile", action:"read"}), userService.GetUserProfile);
 server.put('/DVP/API/:version/User/:name/profile', authorization({resource:"userProfile", action:"write"}), userService.UpdateUserProfile);

 server.get('/DVP/API/:version/Organisations', authorization({resource:"user", action:"read"}), organisationService.GetOrganisations);
 server.get('/DVP/API/:version/Organisation', authorization({resource:"user", action:"read"}), organisationService.GetOrganisation);
 server.del('/DVP/API/:version/Organisation', authorization({resource:"user", action:"delete"}), organisationService.DeleteOrganisation);
 server.post('/DVP/API/:version/Organisation', authorization({resource:"user", action:"write"}), organisationService.CreateOrganisation);
 server.patch('/DVP/API/:version/Organisation', authorization({resource:"user", action:"write"}), organisationService.UpdateOrganisation);

 server.get('/DVP/API/:version/Users/:name/Scope', authorization({resource:"userScope", action:"write"}), userService.GetUserScopes);
 server.put('/DVP/API/:version/Users/:name/Scope', authorization({resource:"userScope", action:"write"}), userService.AddUserScopes);
 server.del('/DVP/API/:version/User/:name/Scope/:scope', authorization({resource:"userScope", action:"delete"}), userService.DeleteUser);

 server.get('/DVP/API/:version/Users/:name/Scope', authorization({resource:"userAppScope", action:"write"}), userService.GetAppScopes);
 server.put('/DVP/API/:version/Users/:name/AppScope', authorization({resource:"userAppScope", action:"write"}), userService.AddUserAppScopes);
 server.del('/DVP/API/:version/User/:name/AppScope/:scope', authorization({resource:"userAppScope", action:"delete"}), userService.RemoveUserAppScopes);


 server.get('/DVP/API/:version/Users/:name/UserMeta', authorization({resource:"userMeta", action:"read"}), userService.GetUserMeta);
 server.put('/DVP/API/:version/Users/:name/UserMeta', authorization({resource:"userMeta", action:"write"}), userService.UpdateUserMetadata);

 server.get('/DVP/API/:version/Users/:name/AppMeta', authorization({resource:"userAppMeta", action:"read"}), userService.GetAppMeta);
 server.put('/DVP/API/:version/Users/:name/AppMeta', authorization({resource:"userAppMeta", action:"write"}), userService.UpdateAppMetadata);




 server.listen(port, function () {

 logger.info("DVP-UserService.main Server %s listening at %s", server.name, server.url);

 });

 */
