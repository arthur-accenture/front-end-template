var express = require('express');
var app = express();

app.use(express.static('dist'));

app.listen(9080, function(){
    console.log('Listening');
});