restify = require('restify')
radio = require('./radio')
fs = require('fs');

server = restify.createServer({ name: 'radio-api' })
server.use(restify.fullResponse())
server.use(restify.queryParser())

io = require('socket.io').listen(server)

# Router
server.get('/', (req, res, next) ->
    fs.readFile(__dirname + '/index.html', (err, data) ->
        if (err)
            next(err)
            return

        res.setHeader('Content-Type', 'text/html')
        res.writeHead(200)
        res.end(data)
        next()
    )
)

server.get(/^\/?.*/, restify.serveStatic({
    'directory': __dirname
 }));

server.get('/radio', (req, res, next) ->
	cf = req.params.cf
	span = req.params.span
	resBw = req.params.resBw
	vidBw = req.params.vidBw
	refLvl = req.params.refLvl
	scale = req.params.scale
	res.send(radio.getPsd(cf, span, resBw, vidBw, refLvl, scale))
)

# Socket.IO events
io.sockets.on('connection', (socket) ->
	console.log("New connection: id = #{ socket.id }") 
	socket.emit('connected')
	socket.on('getPsd', (data) -> 
		socket.emit('psd', radio.getPsd(data.cf, data.span, data.resBw, data.vidBw, data.refLvl, data.scale))
	)
)

server.listen(8080, -> 
	console.log "#{ server.name } listening at #{ server.url }")
