var cleanAll = function () {
    $(".navbar-nav").html("")
    $("#main").html("")
    $("#alerts").html("")
    //title
    $("#incomeTitle").html("")
    $("#outcomeTitle").html("")
    //registry
    $("#registry").html("")
    //table
    $("#totAwardedBE").html("")
    $("#totPaidBE").html("")
    $("#totAwardedByPA").html("")
    $("#totPaidByPA").html("")
    //contracts
    $("#takenContracts").html("")
    $("#wonContracts").html("")
    //bars
    $("#linkVatIDPA").html("")
    $("#linkVatIDPANum").html("")
    $("#linkVatIDBE").html("")
    $("#linkVatIDBENum").html("")
    $("#titleLinkVatIDPA").html("")
    $("#titleLinkVatIDPANum").html("")
    $("#titleLinkVatIDBE").html("")
    $("#titleLinkVatIDBENum").html("")
    //bubbles
    $("#titleProcedureType").html("")
    $("#view_selection").html("")
    $("#vis").html("")
};

var loadAll = function (vatId) {

    cleanAll();
    alertInfo("Loading all data...");

    var registryStore = new rdf.LdpStore();
    var registrySource = '/labelVatIDOfBusinessEntity/' + vatId;
    registryStore.graph(registrySource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#registry').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });
    
    var allContractsStore = new rdf.LdpStore();
    var allContractsSource = '/allContracts/' + vatId;

    allContractsStore.graph(allContractsSource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#takenContracts').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var allWonContractsStore = new rdf.LdpStore();
    var allWonContractsSource = '/allWonContracts/' + vatId;
    allWonContractsStore.graph(allWonContractsSource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#wonContracts').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var sumAwardedBEStore = new rdf.LdpStore();
    var sumAwardedBESource = '/sumAwardedByBusinessEntity/' + vatId;
    sumAwardedBEStore.graph(sumAwardedBESource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#main').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var sumAwardedPAStore = new rdf.LdpStore();
    var sumAwardedPASource = '/sumAwardedByPA/' + vatId;
    sumAwardedPAStore.graph(sumAwardedPASource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#main').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var numAwardedBEStore = new rdf.LdpStore();
    var numAwardedBESource = '/numAwardedByBusinessEntity/' + vatId;
    numAwardedBEStore.graph(numAwardedBESource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#main').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var numOfContractsWonPerCompanyStore = new rdf.LdpStore();
    var numOfContractsWonPerCompanySource = '/numOfContractsWonPerCompany/' + vatId;
    numOfContractsWonPerCompanyStore.graph(numOfContractsWonPerCompanySource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#numCompany').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var totAwardedBEStore = new rdf.LdpStore();
    var totAwardedBESource = '/totAwardedBusinessEntity/' + vatId;
    totAwardedBEStore.graph(totAwardedBESource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#totAwardedBE').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var totAwardedPAStore = new rdf.LdpStore();
    var totAwardedPASource = '/totAwardedByPA/' + vatId;
    totAwardedPAStore.graph(totAwardedPASource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#totAwardedByPA').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var totPaidBEStore = new rdf.LdpStore();
    var totPaidBESource = '/totPaidBusinessEntity/' + vatId;
    totPaidBEStore.graph(totPaidBESource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#totPaidBE').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var totPaidPAStore = new rdf.LdpStore();
    var totPaidPASource = '/totPaidByPA/' + vatId;
    totPaidPAStore.graph(totPaidPASource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#totPaidByPA').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });

    var procedureTypeStore = new rdf.LdpStore();
    var procedureTypeSource = '/procedureType/' + vatId;
    procedureTypeStore.graph(procedureTypeSource, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': "http://public-contracts.nexacenter.org/id/businessEntities/" + vatId} , function (out) {
                $('#main').html(out);
                closeAlert(".uduvudualert");
            });
        } else {
            alertDanger(error);
        };
    });
}

// prepare visualizer templates for uduvudu
$("#templates").load("/uduvudu/templates.html");
