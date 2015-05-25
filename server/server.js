var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape/*', function(req, res){
	// Let's scrape MAL

	var username = req.originalUrl.substr(8);

	var headers = {
    'User-Agent':       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Content-Type':     'text/html'
	};

	var optionsMAL = {
    	url: 'http://myanimelist.net/animelist/' + username,
    	headers: headers,
    	jar: true
	};

	request.jar();
	request.cookie('is_logged_in=1');

	GLOBAL.title = [];
	GLOBAL.episode = [];
	GLOBAL.downloadlink = [];
	GLOBAL.success = false;

	request(optionsMAL, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			if ($('body').html().length > 1000) {
				console.log("Success!");
				//Starts at 6
				var anime_number = 6;
				while (!$('#list_surround').children().eq(anime_number).find('span').text() == "") {
					if ($('#list_surround').children().eq(anime_number).find('span').text() == "Spcl.DL EpsDev.") {
						break;
					}

					//Anime title
					title.push($('#list_surround').children().eq(anime_number).find('span').text());

					//Episode number
					var slash_pos = $('#list_surround').children().eq(anime_number).text().indexOf('/');
					episode.push($('#list_surround').children().eq(anime_number).text().slice(slash_pos-3, slash_pos).replace(/\t/g, ""));

					anime_number = anime_number + 2;
				}
				success = true;
				//Loop to get all download links
	if (success == true) {
		console.log("Starting for loop. Success = " + success);
		for (i = 0; i < episode.length; i++) {

		episode[i] = parseInt(episode[i])+1;
		if (episode[i] < 10) {
			episode[i] = "0" + episode[i];
		}

		var url = "http://www.nyaa.se/?page=search&cats=1_37&filter=2&term=" + title[i].replace(/ /g, "+").replace(/:/g, "") + "+" + episode[i];
		console.log(url);

    	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			downloadlink.push($('#main .content .tlist .tlistrow .tlistdownload').children().first().attr('href'));
			console.log($('#main .content .tlist .tlistrow .tlistdownload').children().first().attr('href'));
		}
		});
		}
		res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
  		res.end('<h3>Title: ' + title + '</h3>\n' + '<h3>Episode: ' + episode + '</h3>\n' + '<h3>Number of series: ' + episode.length + '</h3>\n' + '<h3>Download links: ' + downloadlink + '</h3>\n');
	}
			} else {
				console.log("Failure!");
				res.send("Failure!");
			}
		}     
	});
	
	

	
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;