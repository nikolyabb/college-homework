const express = require('express');
const app = express();

app.get('/', function(request, response){
	response.end('Hello there!');
});

app.listen(3000);
