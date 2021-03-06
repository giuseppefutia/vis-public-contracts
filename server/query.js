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
        "PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
        "PREFIX time: <http://www.w3.org/2006/time#> " +
        "PREFIX payment: <http://reference.data.gov.uk/def/payment#> ";

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
        "CONSTRUCT {<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <http://public-contracts.nexacenter.org/id/contract> ?cig . " +
        "?cig rdfs:label ?cigLabel } " +
        "WHERE {?pc <http://purl.org/procurement/public-contracts#bidder> <http://public-contracts.nexacenter.org/id/businessEntities/" + id + "> . " +
        "?cig <http://purl.org/procurement/public-contracts#tender> ?pc . " +
        "?cig rdfs:label ?cigLabel ." +
        "} ");
}

exports.labelVatIDOfBusinessEntity = function (id) {
    return encodeURIComponent(prefixes +
        "CONSTRUCT{?businessEntity rdfs:label ?businessEntityLabel . " +
        "?businessEntity <http://purl.org/goodrelations/v1#vatID> ?vatID} " + 
        "WHERE{ " +
        "SELECT distinct ?businessEntity ?vatID SAMPLE(?label) as ?businessEntityLabel WHERE " +
        " {?businessEntity <http://purl.org/goodrelations/v1#vatID> '"+ id +"'. " +
        "?businessEntity rdfs:label ?label . " +
        "?businessEntity <http://purl.org/goodrelations/v1#vatID> ?vatID} LIMIT 100 " +
        "} ");
}

// OK
exports.allWonContracts = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes +
        "CONSTRUCT {<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <http://public-contracts.nexacenter.org/id/wonContract> ?cig . " +
        "?cig rdfs:label ?cigLabel } " +
        "WHERE {?pc <http://purl.org/procurement/public-contracts#bidder> <http://public-contracts.nexacenter.org/id/businessEntities/" + id + "> . " +
        "?cig <http://purl.org/procurement/public-contracts#awardedTender> ?pc . " +
        "?cig rdfs:label ?cigLabel ." +
        "} ");
}

// OK
exports.sumAwardedByBusinessEntity = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes +
       "CONSTRUCT { <http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <http://public-contracts.nexacenter.org/id/awardedPaymentFrom> ?PA . " +
       "?PA <http://public-contracts.nexacenter.org/id/awarded> ?money . " +
       "?PA rdfs:label ?labelPA. } " +
       "WHERE{ " +
           "SELECT ?PA (SUM(?amount) as ?money) ?labelPA " +
           "WHERE { " +
           "{ " +
               "SELECT DISTINCT ?contract ?PA ?amount SAMPLE(?label) as ?labelPA " +
                "WHERE { " +
               "?bEntity gr:vatID '"+ id +"'. " +
               "?tender pc:bidder ?bEntity . " +
               "?contract pc:awardedTender ?tender . " +
               "?contract pc:agreedPrice ?amount . " +
               "?contract pc:contractingAutority ?PA. " + 
               "?PA rdfs:label ?label " +
               "} } " +
           "} " +
       "} ORDER BY DESC(?money) LIMIT 10 ");
}

// OK
exports.numAwardedByBusinessEntity = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/06294960015;
    return encodeURIComponent(prefixes + 
        "CONSTRUCT {<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + ">  <http://public-contracts.nexacenter.org/id/numberOfPaymentFrom> ?PA . " +
        "?PA <http://public-contracts.nexacenter.org/id/awarded> ?nWonContracts. " +
        "?PA rdfs:label ?labelPA.} " +
        "WHERE { " +
            "SELECT (COUNT(?contract) as ?nWonContracts) ?PA ?labelPA " +
            "WHERE " +
            "{ " +
                "SELECT DISTINCT SAMPLE(?label) as ?labelPA ?contract ?PA " +
                "WHERE " +
                "{ " +
                "?bEntity gr:vatID '"+ id +"'. " +
                "?tender pc:bidder ?bEntity. " +
                "?contract pc:awardedTender ?tender; " + 
                           "pc:contractingAutority ?PA. " +
                           "?PA rdfs:label ?label " +
                "} " +
            "} " +
        "}ORDER BY DESC(?nWonContracts) LIMIT 10 ");
}

// Agreed amount of money from a PA
// OK
exports.sumAwardedByPA = function (id) { // Example id: 00518460019
    return encodeURIComponent(prefixes +
        "CONSTRUCT{ ?PA <http://public-contracts.nexacenter.org/id/awardsBusinessEntity> ?bidder . " +
        "?bidder <http://public-contracts.nexacenter.org/id/awarded> ?money . " +
        "?bidder rdfs:label ?company } " +
        "WHERE { " +
        "SELECT ?PA ?bidder  (SUM(?price) as ?money) ?company " +
        "WHERE { " +
        "SELECT DISTINCT ?contract ?bidder ?PA ?price (SAMPLE(?label) as ?company) " +
        " WHERE { ?PA gr:vatID '" + id + "' . " + 
        " ?contract pc:contractingAutority ?PA . " +
        " ?contract pc:awardedTender ?tender . " +
        " ?contract pc:agreedPrice ?price . " +
        "?tender pc:bidder  ?bidder . " +
        " ?bidder gr:vatID   ?bidderVatID . " +
        "?bidder rdfs:label ?label . " +
        " } " +
        "} " +
        "} ORDER BY DESC(?money) LIMIT 10");
}


// OK
exports.numOfContractsWonPerCompany = function (id) {
    return encodeURIComponent(prefixes +
        "CONSTRUCT{<http://public-contracts.nexacenter.org/id/businessEntities/"+ id + "> <http://public-contracts.nexacenter.org/id/hire> ?company . " +
        "?company rdfs:label ?labelCompany.  " +
        "?company <http://public-contracts.nexacenter.org/id/awarded> ?wonContracts} " +
        "WHERE{ " +
        "SELECT ?company (COUNT( ?company) as ?wonContracts) ?labelCompany " +
        "WHERE { " +
        "SELECT DISTINCT ?contract SAMPLE(?label) as ?labelCompany ?company " +
        "WHERE " +
        "{ " +
         "?PA gr:vatID '" + id + "'. " +
         "?contract pc:contractingAutority ?PA. " +
         "?contract pc:awardedTender ?tender . " +
         "?tender pc:bidder ?company. " +
        "?company rdfs:label ?label. " +
        "} " +
        "} " +
        "} ORDER BY DESC (?wonContracts) LIMIT 10");
}


// OK
exports.totAwardedBusinessEntity = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes + 
        "CONSTRUCT {?company <http://public-contracts.nexacenter.org/id/awardedTotal> ?awardedTotal . }  " +
        "WHERE{ " +
        "SELECT SUM(?amount) as ?awardedTotal ?company  " +
        "WHERE{  " +
            "SELECT DISTINCT ?amount ?company  " +
            "WHERE {  " +
            "?company <http://purl.org/goodrelations/v1#vatID> '" + id + "'. " +
            "?bid pc:bidder ?company .  " +
            "?contract pc:awardedTender ?bid .  " +
            "?contract pc:agreedPrice ?amount .  " +
            "}  " +
        "}  " +

        "} ");
}

// Amount of money received by a specific company
// OK
exports.totPaidBusinessEntity = function (id) { // Example: http://public-contracts.nexacenter.org/id/businessEntities/04145300010;
    return encodeURIComponent(prefixes + 
        "CONSTRUCT {?company <http://public-contracts.nexacenter.org/id/paidTotal> ?paidTotal . } " +
        "WHERE{ " +
            "SELECT SUM(?amount) as ?paidTotal ?company " +
            "WHERE { " +
            "SELECT DISTINCT ?contract ?amount ?company  " +
            "WHERE { " +
            "?company <http://purl.org/goodrelations/v1#vatID> '" + id + "'. " +
            "?bid pc:bidder ?company . " +
            "?contract pc:awardedTender ?bid . " +
            "?contract payment:payment ?payment . " + 
            "?payment payment:netAmount ?amount . " +
            "} " +
            "} " +
        "} ");
}

// Amount of money awarded by a specific PA
// OK
exports.totAwardedByPA = function (id) { // Example: 
    return encodeURIComponent(prefixes +
        "CONSTRUCT {?contractingAutority <http://public-contracts.nexacenter.org/id/awardsTotal> ?money} " +
        "WHERE { " +
        "SELECT SUM(?amount) as ?money ?contractingAutority " +
        "WHERE{ " +
            "SELECT DISTINCT ?contract ?amount ?contractingAutority " +
            "WHERE { " +
            "?contractingAutority <http://purl.org/goodrelations/v1#vatID> '" + id + "'. " +
            "?contract pc:contractingAutority  ?contractingAutority. " +
            "?contract pc:agreedPrice  ?amount. " +
            "} " +
            "} " +
        "}" );
}

// Amount of money paid by a specific PA
// OK
exports.totPaidByPA = function (id) { // Example: vatID = 00518460019
    return encodeURIComponent(prefixes + 
        "CONSTRUCT {?contractingAutority <http://public-contracts.nexacenter.org/id/paysTotal> ?pay} " +
        "WHERE{ " +
            "SELECT ?contractingAutority SUM(?amount) as ?pay " +
            "WHERE { " +
                "SELECT DISTINCT * " +
                "WHERE { " +
                "?contractingAutority <http://purl.org/goodrelations/v1#vatID> '" + id + "'. " +
                "?contract pc:contractingAutority  ?contractingAutority. " +
                "?contract payment:payment ?payment. " +
                "?payment payment:netAmount ?amount. " +
                "} " +
            "} " +
        "} ");
}

// OK
exports.procedureType = function (id) {
    return encodeURIComponent(prefixes + 
        "CONSTRUCT{ <http://public-contracts.nexacenter.org/id/businessEntities/" + id +"> <http://public-contracts.nexacenter.org/id/hasContract> ?contract . " +
        "?contract rdfs:label ?contractLabel . " +
        "?contract <http://public-contracts.nexacenter.org/id/import> ?amount . " +
        "?contract time:year ?year . " +
        "?contract <http://public-contracts.nexacenter.org/id/procedureType> ?labelProcType .} " +
        "WHERE{ " +
            "SELECT ?contract ?amount ?procType ?contractLabel SAMPLE(?label) as ?labelProcType ?year " +
            "WHERE { " + 
             "{ " +
                 "SELECT DISTINCT ?contract ?amount ?procType ?contractLabel ?year " +
                "{ " +
                  "?contractingAutority <http://purl.org/goodrelations/v1#vatID> '" + id + "'. " +
                  "?contract pc:contractingAutority  ?contractingAutority. " +
                  "?contract pc:procedureType ?procType. " +
                  "?contract pc:agreedPrice ?amount. " +
                  "?contract time:year ?year. " +
                  "?contract rdfs:label ?contractLabel . " +
                "} GROUP BY ?procType } " +
                "?procType rdfs:label ?label . " +
            "} " +
        "} ORDER BY DESC(?amount) LIMIT 100");
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

exports.searchString = function (request, response, params) {
    var parsedJSON = require('../data/autocomplete.json'),
        str = params.str,
        res = new Object,
        count = 0;

    res.results = resultJSON = [];

    for (var i=0 in parsedJSON) {
        if(parsedJSON[i].name.indexOf(str) > -1 && count < 10) { //XXX better to stop loop
            resultJSON[count] = new Object;
            resultJSON[count].name = parsedJSON[i].name;
            resultJSON[count].vatId = parsedJSON[i].vatId;
            count++
        }
    }
    response.send(JSON.stringify(res));
}

//createAllBusinessEntitiesFile();
