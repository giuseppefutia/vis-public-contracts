var http = require('http');

var host = "public-contracts.nexacenter.org";

var prefixes = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX schema: <http://schema.org/> " +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
        "PREFIX dbo: <http://it.dbpedia.org/ontology> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> " +
        "PREFIX dct: <http://purl.org/dc/terms/> " +
        "PREFIX gr: <http://purl.org/goodrelations/v1#> "
        "PREFIX foaf: <http://xmlns.com/foaf/0.1/>";

exports.test = function() {
    return encodeURIComponent(prefixes +
        "CONSTRUCT {?subject ?property ?object .}" +
        "WHERE {?subject ?property ?object .} LIMIT 100"
        );
}

exports.allBusinessEntities = function () {
    return encodeURIComponent(prefixes +
        "SELECT ?subject ?vatID ?label " +
        "WHERE { " +
            "?subject rdf:type <http://purl.org/goodrelations/v1#BusinessEntity> . " +
            "?subject <http://purl.org/goodrelations/v1#vatID> ?vatID . " +
            "?subject rdfs:label ?label . " +
        "}");
}

exports.launchSparqlQuery = function (request, response, query, acceptFormat) {

    var result = "";

    console.info(decodeURIComponent(query));

    var options = {
        host: host,
        path: "/sparql/?default-graph-uri=&query=" + (typeof(query) === "function" ? query() : query), /// XXX
        port: "80",
        method: "GET",
        headers: {
            accept: acceptFormat
        } 
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            result += chunk;
        });

        res.on('end', function() {
            response.send(result);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

createAllBusinessEntitiesFile = function () {

    var result = "";
    var host = "localhost"; // For testing reasons
    var acceptFormat = "application/json";

    var options = {
        host: host,
        path: "/allBusinessEntities",
        port: "3035",
        method: "GET",
        headers: {
            accept: acceptFormat
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            result += chunk;
        });

        res.on('end', function() {
            //response.send(result);
            var businessEntities = JSON.parse(result)["results"];
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end(); 
}

createAllBusinessEntitiesFile();