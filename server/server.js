var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape MAL

	var headers = {
    'User-Agent':       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Content-Type':     'text/html'
	};

	var options = {
    	url: 'http://myanimelist.net/animelist/pontus53',
    	headers: headers,
    	jar: true
	};

	request.jar();
	request.cookie('is_logged_in=1');

	request(options, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var success = $('body').html().length;
			if (success > 1000) {
				console.log("Success!");
				//Starts at 6
				console.log($('#list_surround').children().eq(6).html());
			} else {
				console.log("Failure!");
			};

			/*$('#list_surround').filter(function(){
		        var data = $(this);
		        title = data.html();

		        json.title = title;
	        })*/
		}

        res.send('Check your console!');
	});
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;