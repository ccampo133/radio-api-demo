var restify = require('restify');
var radio = require('./radio.js');
var fs = require('fs');

var server = restify.createServer({ name: 'radio-api' });
server.use(restify.fullResponse());
server.use(restify.queryParser());

io = require('socket.io').listen(server);

// Router
server.get('/', function(req, res, next) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) {
            next(err);
            return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
});

server.get(/^\/?.*/, restify.serveStatic({
    'directory': __dirname
 }));

server.get('/radio', function(req, res, next) {
	console.log("FOO");
	var cf = req.params.cf;
	var span = req.params.span;
	var resBw = req.params.resBw;
	var vidBw = req.params.vidBw;
	var refLvl = req.params.refLvl;
	var scale = req.params.scale;
	res.send(radio.getPsd(cf, span, resBw, vidBw, refLvl, scale));
});

// Socket.IO events
io.sockets.on('connection', function(socket) {
	console.log("New connection: id = " + socket.id);
	socket.emit('connected');
	socket.on('getPsd', function(data) {
		socket.emit('psd', radio.getPsd(data.cf, data.span, data.resBw, data.vidBw, data.refLvl, data.scale));
	});
});

server.listen(8080, function() {
	console.log(server.name + " listening at " + server.url);
});
