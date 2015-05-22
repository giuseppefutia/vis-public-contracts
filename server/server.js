var express = require('express');

var app = express();

app.use(express.static('../'));

var server = app.listen(3030, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server listening at http://%s:%s', host, port);
});
