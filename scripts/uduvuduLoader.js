var loadAll = function (vatId) {
    
    var allContractsStore = new rdf.LdpStore();
    var allContractsSource = 'http://localhost:3035/allContracts/' + vatId;

    alertInfo("Loading all contracts...");
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
    var allWonContractsSource = 'http://localhost:3035/allWonContracts/' + vatId;
    alertInfo("Loading all won contracts...");
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
}

// prepare visualizer templates for uduvudu
$("#templates").load("/uduvudu/templates.html");
