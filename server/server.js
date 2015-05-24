var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape MAL
	url = 'http://www.myanimelist.net/animelist/pontus53';

	var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
	};

	var options = {
    	url: 'http://samwize.com',
    	method: 'GET',
    	headers: headers,
    	qs: {'key1': 'xxx', 'key2': 'yyy'}
	};


	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title;
			var json = { title : ""};

			title = $('body').html();
			console.log($('body').html());

			/*$('#list_surround').filter(function(){
		        var data = $(this);
		        title = data.html();

		        json.title = title;
	        })*/
		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        });

        res.send('Check your console!');
	});
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;