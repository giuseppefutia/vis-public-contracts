/* smooth scrolling for nav sections */
$('.navbar').on('click', '.smooth', function() {
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top -45
    }, 500);
    return false;
});

/* navbar and title section append */
function appendAssegnati () {
    if($("#hIncomeTitle").length == 0) {
        $("#incomeTitle").append('<br><h3 id="hIncomeTitle">Informazioni sui bandi di gara e contratti assegnati al soggetto</h3><br>');
    }
    if($("#navIncomeTitle").length == 0) {
        $(".navbar-nav").append('<li><a class="smooth" id="navIncomeTitle" href="#incomeTitle">assegnati al soggetto</a></li>');
    }
}

function appendPubblicati() {
    if($("#hOutcomeTitle").length == 0) {
        $("#outcomeTitle").append('<br><h3 id="hOutcomeTitle">Informazioni sui bandi di gara e contratti pubblicati dal soggetto</h3><br>');
    }
    if($("#navOutcomeTitle").length == 0) {
        $(".navbar-nav").append('<li><a class="smooth" id="navOutcomeTitle" href="#outcomeTitle">pubblicati dal soggetto</a></li>');
    }
}

/* info and error alerts */
var alertInfo = function (source) {
    document.getElementById('alerts').innerHTML +=  ''
        + '<div class="alert alert-info uduvudualert">'
        + '  <button type="button" class="close" data-dismiss="alert">&times;</button>'
        + '  <strong>Loading</strong> '+source
        + '</div>';
};

var alertDanger = function (error) {
    document.getElementById('alerts').innerHTML +=  ''
        + '<div class="alert alert-danger">'
        + '  <button type="button" class="close" data-dismiss="alert">&times;</button>'
        + '  <strong>Error:</strong> '+ error +'.'
        + '</div>';
};

/* autoclose alerts */
var closeAlert = function (c) {
    window.setTimeout(function() {
        $(c).fadeTo(1500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 1000);
};

/* autocomplete search */
var items = "";
var labels = function() {
    return function findMatches(q, cb) {
        $.ajax("/searchString/"+q.toUpperCase(),{dataType: "json"}).done(function(data) {
          items = data.results;
          cb(_.sortBy(_.sortBy(data.results, function(b){return b.name.length}),function(s){return -s.name.search(new RegExp('^'+q,'i'))}));
        });
    };
};

$('#query').typeahead({
    hint: true,
    autoselect: true,
    highlight: true,
    minLength: 3
},
{
    name: 'labels',
    displayKey: 'vatId',
    source: labels(),
    templates: {
        suggestion: function(data){
        return '<p><strong>' + data.name + '</strong> - ' + data.vatId + '</p>';
      }
    }
});

/* bubbles utils */
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var reloadBubble = function(view_type) {
    $('#view_selection #all').removeClass('active'); //XXX
    $(this).toggleClass('active');
    custom_bubble_chart.toggle_view(view_type);
}

/* view API */
if (location.search !== "") {
    var viewID = location.search.replace('?', '');
    loadAll(viewID);
}

/* check if stats file exists */
function doesFileExist(urlToFile)
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}
