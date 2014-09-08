var request = require('request');
var fs = require('fs-extra');
var cheerio = require('cheerio');

var builds = [];

request('http://svn.gsa.gov/svn/ivy/gsa/portalweb2.0',function(error, response, html){

	if (!error && response.statusCode == 200) {

		var $ = cheerio.load(html);
	    
		$('li a').each(function(){
			var href = $(this).attr('href');
			if(href.indexOf('.xml') === -1 && href !== '../'){
				href = parseInt(href.replace('/',''));
				builds.push(href);
			}
		});
		getLatest();
	}
});

function getLatest(){
	var latest = Math.max.apply(Math, builds);
	console.log('Downloading Portal Build r'+latest)
	var buildURL = 'http://svn.gsa.gov/svn/ivy/gsa/portalweb2.0/'+latest+'/portal.war';

	var r = request(buildURL).pipe(fs.createWriteStream(__dirname+'/portal.war'));

	r.on('finish', function(){
		console.log('Download Complete')
	});
}

