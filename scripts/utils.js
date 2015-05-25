/* smooth scrolling for nav sections */
$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top -80
    }, 500);
    return false;
});

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
        $.ajax("http://localhost:3035/searchString/"+q,{dataType: "json"}).done(function(data) {
          items = data.results;
          cb(_.sortBy(_.sortBy(data.results, function(b){return b.name.length}),function(s){return -s.name.search(new RegExp('^'+q,'i'))}));
        });
    };
};

var findVatId = function (str) {
    if (items.length === 0) {
        return str;
    }

    for (var i = 0; i < items.length; i++) {
        if (items[i].name == str) {
            return items[i].vatId;
        }
    }
};


$('#query').typeahead({
    hint: true,
    autoselect: true,
    highlight: true,
    minLength: 3
},
{
    name: 'lables',
    displayKey: 'name',
    source: labels()
});
