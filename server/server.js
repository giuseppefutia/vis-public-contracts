var express = require('express');
var PC = require('./query.js');

var app = express();

app.use(express.static('../'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/test', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.test, "text/turtle");
});

app.get('/labelVatIDOfBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.labelVatIDOfBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/allContracts/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allContracts(request.param("id")), "text/turtle");
});

app.get('/allWonContracts/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allWonContracts(request.param("id")), "text/turtle");
});

app.get('/sumAwardedByBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.sumAwardedByBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/numAwardedByBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.numAwardedByBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/numOfContractsWonPerCompany/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.numOfContractsWonPerCompany(request.param("id")), "text/turtle");
});

app.get('/sumAwardedByPA/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.sumAwardedByPA(request.param("id")), "text/turtle");
});

app.get('/totAwardedBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.totAwardedBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/totAwardedByPA/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.totAwardedByPA(request.param("id")), "text/turtle");
});

app.get('/totPaidBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.totPaidBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/totPaidByPA/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.totPaidByPA(request.param("id")), "text/turtle");
});

app.get('/procedureType/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.procedureType(request.param("id")), "text/turtle");
});

app.get('/allBusinessEntities', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allBusinessEntities, "application/json");
});

app.get('/searchString/:str', function (request, response) {
    PC.searchString(request, response, request.params);
});

app.get('/view/:id', function(req, res) {
    backURL=req.header('Referer') || '/?'+req.params.id;
    res.redirect(backURL);
});

var server = app.listen(3035, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server listening at http://%s:%s', host, port);
});
