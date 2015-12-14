//Set up requirements
var express = require("express");
var logger = require('morgan');
var Request = require('request');

//Create an 'express' object
var app = express();

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

/*-----
ROUTES
-----*/

//Main Page Route - NO data
app.get("/", function(req, res){
	res.render('index'); //, dataForThePage
});

app.get("/index", function(req, res){
	res.render('index'); //, dataForThePage
});

//Main Page Route - WITH data requested via the client
app.get("/buttonPress", function(req, res){
	res.render('gallery'); // , dataForThePage
});

app.get("/aboutPress", function(req, res){
	res.render('about'); // , dataForThePage
});

//JSON Serving route - request to wikipedia
/*app.get("/api/:word", function(req, res){
	//CORS enable this route - http://enable-cors.org/server.html
	//anybody can get data from anybody
	res.header('Access-Control-Allow-Origin', "*");
	var currentWord = req.params.word;
	var requestURL = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + currentWord;
	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			var theData = JSON.parse(body);
			//console.log(theData);
			// we send the data here
			res.json(theData);
		}
	});
});*/

//Catch All Route
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});

// Start the server
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port 3000');