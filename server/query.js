var http = require('http');
var fs = require('fs');

var host = "public-contracts.nexacenter.org";

var prefixes = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX schema: <http://schema.org/> " +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
        "PREFIX dbo: <http://it.dbpedia.org/ontology> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> " +
        "PREFIX dct: <http://purl.org/dc/terms/> " +
        "PREFIX gr: <http://purl.org/goodrelations/v1#> " +
        "PREFIX pc: <http://purl.org/procurement/public-contracts#> " +
        "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
        "PREFIX payment: <http://reference.data.gov.uk/def/payment#>";

exports.test = function() {
    return encodeURIComponent(prefixes +
        "CONSTRUCT {?subject ?property ?object .} " +
        "WHERE {?subject ?property ?object .} LIMIT 100"
        );
}

exports.allBusinessEntities = function () {
    return encodeURIComponent(prefixes +
        "SELECT distinct ?subject ?vatID ?label " +
        "WHERE { " +
            "?subject rdf:type <http://purl.org/goodrelations/v1#BusinessEntity> . " +
            "?subject <http://purl.org/goodrelations/v1#vatID> ?vatID . " +
            "?subject rdfs:label ?label . " +
        "}");
}

exports.allContracts = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes +
        "CONSTRUCT {<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <contract> ?cig . " +
        "?cig rdfs:label ?cigLabel } " +
        "WHERE {?pc <http://purl.org/procurement/public-contracts#bidder> <http://public-contracts.nexacenter.org/id/businessEntities/" + id + "> . " +
        "?cig <http://purl.org/procurement/public-contracts#tender> ?pc . " +
        "?cig rdfs:label ?cigLabel ." +
        "} ");
}

exports.allWonContracts = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes +
        "CONSTRUCT {<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <wonContract> ?cig . " +
        "?cig rdfs:label ?cigLabel } " +
        "WHERE {?pc <http://purl.org/procurement/public-contracts#bidder> <http://public-contracts.nexacenter.org/id/businessEntities/" + id + "> . " +
        "?cig <http://purl.org/procurement/public-contracts#awardedTender> ?pc . " +
        "?cig rdfs:label ?cigLabel ." +
        "} ");
}

exports.sumReceivedByBusinessEntity = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes +
        "CONSTRUCT { <http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <receivesPaymentFrom> ?PA . " +
        "?PA <paid> ?importoSommeVersate .} " +
        "WHERE { " +
        "{ " +
            "SELECT ?PA (SUM(?amount) as ?importoSommeVersate) { " +
            "?bEntity gr:vatID '" + id + "' . " +
            "?tender pc:bidder ?bEntity . " +
            "?contract pc:awardedTender ?tender . " +
            "?contract payment:payment ?payment . " +
            "?payment payment:netAmount ?amount . " +
            "?contract pc:contractingAutority ?PA . " +
            "} GROUP BY ?PA }" +
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
            var businessEntities = JSON.parse(result)["results"];
            var businessEntitiesData = new Array();
            var controller = new Array();
            
            for (var be in businessEntities) {
                for (var i = 0 ; i < businessEntities[be].length; i++) {
                    var vatID = businessEntities[be][i]["vatID"]["value"];
                    var label = businessEntities[be][i]["label"]["value"];
                    var json = {
                        "vatId": "",
                        "name": ""
                    };
                    json["vatId"] = vatID;
                    json["name"] = label;
                  
                    if(indexOf.call(controller, vatID) === -1) {
                        businessEntitiesData.push(json);
                        controller.push(vatID);
                    }
                }
            }
            var outputFilename = '../data/autocomplete.json';

            fs.writeFile(outputFilename, JSON.stringify(businessEntitiesData, null, 4), function (err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("JSON saved to " + outputFilename);
                }
            }); 
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end(); 
}

var indexOf = function (needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};

//createAllBusinessEntitiesFile();