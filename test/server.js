var express = require('express');
var app = express();
var port = 9080

app.use(express.static('dist'));
app.use('/test', express.static('dist'));

app.listen(port, function(){
    console.log('Listening on port ' + port);
});