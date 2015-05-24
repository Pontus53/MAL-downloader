var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape/*', function(req, res){
	// Let's scrape MAL

	var username = req.originalUrl.substr(8);
	console.log(username);

	var headers = {
    'User-Agent':       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Content-Type':     'text/html'
	};

	var options = {
    	url: 'http://myanimelist.net/animelist/' + username,
    	headers: headers,
    	jar: true
	};

	request.jar();
	request.cookie('is_logged_in=1');

	request(options, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title = [];
			var episode = [];

			var success = $('body').html().length;
			if (success > 1000) {
				console.log("Success!");
				//Starts at 6
				var anime_number = 6;
				while (!$('#list_surround').children().eq(anime_number).find('span').text() == "") {
					if ($('#list_surround').children().eq(anime_number).find('span').text() == "Spcl.DL EpsDev.") {
						break;
					};

					//Anime title
					title.push($('#list_surround').children().eq(anime_number).find('span').text());
					console.log(title[0].charAt(9));

					//Episode number
					var slash_pos = $('#list_surround').children().eq(anime_number).text().indexOf('/');
					episode.push($('#list_surround').children().eq(anime_number).text().slice(slash_pos-3, slash_pos).replace(/\t/g, ""));

					anime_number = anime_number + 2;
				};
			} else {
				console.log("Failure!");
			};

			/*$('#list_surround').filter(function(){
		        var data = $(this);
		        title = data.html();

		        json.title = title;
	        })*/
		}

        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
  		res.end('<h3>Title: ' + title + '</h3>\n' + '<h3>Episode: ' + episode + '</h3>\n' + '<h3>Number of series: ' + episode.length + '</h3>\n');
	});
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;