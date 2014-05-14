getPsd = (centerFreq, span, resBw, vidBw, refLvl, scale) ->
	start = centerFreq - span / 2.0
	n = (span / resBw)
	x = (start + i*resBw for i in [0..n])
	wave = sinc
	y = (wave(xi) + randNormal(0, 0.05) for xi in x)
	psd = 
		refLvl: refLvl
		scale: scale
		resBw: resBw
		vidBw: vidBw
		freq: x
		psd: y
	return psd

randNormal = (mu, sigma) ->
	u1 = Math.random()
	u2 = Math.random()
	normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
	return mu + sigma * normal

square = (x) ->
	return 2 * Math.floor(x) - Math.floor(2 * x) + 1

sawtooth = (x) ->
	return x - Math.floor(x)

sinc = (x) ->
	return Math.sin(x) / x

exports.getPsd = getPsd