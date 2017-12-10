var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var say = require('say');
var urlMetadata = require('url-metadata');
var urlRegex = /(https?:\/\/[^ ]*)/;
server.listen(3000);

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/package.json');
});


var helper = {
    getUrlMetaInfo: function (input, callback) {
        console.log(input);
        var urls = input.match(urlRegex);
        console.log(urls);
        if (urls !== null) {
            var url = urls[0];
            urlMetadata(url).then(
                function (metadata) {
                    console.log('ok');
                    console.log(metadata);
                    callback(null, metadata);
                },
                function (error) {
                    console.log('not ok');
                    callback(null, {})
                });
        } else {
            callback(null, {})
        }
    }
};


var request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
request({uri: 'https://en.wikipedia.org/wiki/ball'}, function(err, response, html){
    var dom = new JSDOM(html);
    var body = dom.window.document.querySelector("body");
    var mwbody = body.querySelector(".mw-body");
    var mwContentText = mwbody.querySelector("p").textContent;
    console.log(mwContentText);
});



