/* smooth scrolling for nav sections */
$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top -80
    }, 500);
    return false;
});

/* info and error alerts */
var timeAlertInfo = function (source) {
    document.getElementById('time').innerHTML +=  ''
        + '<div class="alert alert-info timealert">'
        + '  <button type="button" class="close" data-dismiss="alert">&times;</button>'
        + '  <strong>Loading</strong> '+source
        + '</div>';
};

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
var productNames = new Array();
var productIds = new Object();
$.getJSON( './data/autocomplete.json', null,
        function ( jsonData )
        {
            $.each( jsonData, function ( index, product )
            {
                productNames.push( product.name );
                productIds[product.name] = product.vatId;
            } );
            $( '#query' ).typeahead( { local:productNames } );
            $('.tt-query').css('background-color','#fff');
        } );

/*$('#query').typeahead({        
     prefetch: '../data/autocomplete.json',
     limit: 10
}); */


