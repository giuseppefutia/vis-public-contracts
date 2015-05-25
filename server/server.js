var express = require('express');
var PC = require('./query.js');

var app = express();

app.use(express.static('../'));

app.get('/test', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.test, "text/turtle");
});

app.get('/allContracts/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allContracts(request.param("id")), "text/turtle");
});

app.get('/allWonContracts/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allWonContracts(request.param("id")), "text/turtle");
});

app.get('/sumReceivedByBusinessEntity/:id', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.sumReceivedByBusinessEntity(request.param("id")), "text/turtle");
});

app.get('/allBusinessEntities', function (request, response) {
    PC.launchSparqlQuery(request, response, PC.allBusinessEntities, "application/json");
});

app.get('/searchString/:str', function (request, response) {
    PC.searchString(request, response, request.params);
});

var server = app.listen(3035, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server listening at http://%s:%s', host, port);
});
