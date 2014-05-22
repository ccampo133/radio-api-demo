function getPsd(centerFreq, span, resBw, vidBw, refLvl, scale) {
	var start = centerFreq - span / 2.0;
	var n = (span / resBw);
	var wave = sinc;
	var x = [];
	var y = [];
	for(var i = 0; i < n; i++) {
		x.push(start + i * resBw);
		y.push(wave(x[i]) + randNormal(0, 0.05));
	}

	var psd = {
		refLvl: refLvl,
		scale: scale,
		resBw: resBw,
		vidBw: vidBw,
		freq: x,
		psd: y,
	};

	return psd;
}

function randNormal(mu, sigma) {
	var u1 = Math.random();
	var u2 = Math.random();
	var normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	return mu + sigma * normal;
}

function square(x) {
	return 2 * Math.floor(x) - Math.floor(2 * x) + 1;
}

function sawtooth(x) { 
	return x - Math.floor(x);
}

function sinc(x) {
	return Math.sin(x) / x;
}

exports.getPsd = getPsd;