var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var say = require('say');
var urlMetadata = require('url-metadata');
var urlRegex = /(https?:\/\/[^ ]*)/;

var request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var allow = 1;

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

io.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('message', function (data) {
        console.log(data);
        allow = 1;
        if(data === 'please stop' || data === 'stop' || data === 'don\'t talk'){
            say.stop();
            allow = 0;
            say.speak('Ok! As you wish.', 'Cellos', 1);
        }
        else if(data === 'hello'){
            if(allow === 1)
            say.speak('hi', 'Cellos', 1);
        }
        else if(data === 'hi'){
            if(allow === 1)
            say.speak('hello', 'Cellos', 1);
        }
        else if(data === 'what is your name' || data === 'what\'s your name'){
            if(allow === 1)
            say.speak('I am Anto. Who are you?', 'Cellos', 1);
        }
        else if(data === 'Maliha'){
            if(allow === 1)
            say.speak('Hello Maliha. Nice to meet you. Ami tomar kotha onek shunesi. Tumi khub misti meeyee. Tomar priyo color purple. tumi banglay beaguni bolo.', 'Cellos', 0.8);
        }
        else if(data === 'Ranu'){
            if(allow === 1)
            say.speak('Hi Ranu. Nice name by the way. Ami tomar kotha onek shunesi. Tumi khub valo kobeeta likho. Amakey neyaie o ekta kobeeta likhty hobee', 'Cellos', 0.8);
        }
        else if(data === 'how are you'){
            if(allow === 1)
            say.speak('I am Fine. Thank you. Hope you are doing well.', 'Cellos', 1);
        }
        else if((/tell me about/g).test(data)){
            var topicArr = data.split(' ');
            var topic = topicArr[topicArr.length - 1];
            var url = 'https://'+topic.toLowerCase()+'.com';
            if(allow === 1)
            say.speak('Please let me do some search about '+topic, 'Cellos', 1, function () {
                setTimeout(function () {
                    helper.getUrlMetaInfo(url, function (err,info) {
                        setTimeout(function () {
                            if(allow === 1)
                            say.speak('What I found about '+topic+' is', 'Cellos', 1, function () {
                                setTimeout(function () {
                                    var description = info.description;
                                    var rv = description;
                                    console.log(rv);
                                    if(allow === 1)
                                    say.speak(rv, 'Cellos', 1);
                                }, 2000);
                            });
                        }, 2000);
                    });
                }, 2000)
            });
        }
        else if((/what is/g).test(data)){
            var topic = data.replace("what is ", "");
            var topicSearch = topic.replace(' ', "_");
            var url = 'https://en.wikipedia.org/wiki/'+topicSearch.toLowerCase();
            if(allow === 1)
            say.speak('Please let me do some search about '+topic, 'Cellos', 1, function () {
                setTimeout(function () {
                    request({uri: url}, function(err, response, html){
                        var dom = new JSDOM(html);
                        var body = dom.window.document.querySelector("body");
                        var mwbody = body.querySelector(".mw-body");
                        var mwContentText = mwbody.querySelector("p").textContent;
                        var description = mwContentText;
                        var rv = description.replace(/\[[^\]]+\]/g, "");
                        console.log(rv);
                        if(allow === 1)
                        say.speak(rv, 'Cellos', 1);
                    });
                }, 2000)
            });
        }
        else {
            if(allow === 1)
            say.speak('Sorry. Don\'t get it. Please speak again', 'Cellos', 1);
        }
    });
});

// Use default system voice and speed
// say.speak('Valo achi. tumi  Kemon asho?', 'Cellos', 0.5);
