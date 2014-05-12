restify = require('restify')
radio = require('./radio')

server = restify.createServer({name: 'radio-api'})
server.use(restify.fullResponse())
server.use(restify.queryParser())

# Routes
server.get('/radio', (req, res, next) ->
	cf = req.params.cf
	span = req.params.span
	resBw = req.params.resBw
	vidBw = req.params.vidBw
	refLvl = req.params.refLvl
	scale = req.params.scale
	res.send(radio.getPsd(cf, span, resBw, vidBw, refLvl, scale))
)

server.listen(3000, -> console.log "#{ server.name } listening at #{ server.url }")