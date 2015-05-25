var loadAll = function (vatId) {
    var store = new rdf.LdpStore();
    var source = 'test';

    alertInfo("loading...");
    store.graph(source, function (graph, error) {
        if (error == null) {
            uduvudu.process(graph, {'resource': vatId} , function (out) {
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
