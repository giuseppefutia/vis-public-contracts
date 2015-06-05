/* smooth scrolling for nav sections */
$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top -50
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
        $.ajax("/searchString/"+q.toUpperCase(),{dataType: "json"}).done(function(data) {
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
