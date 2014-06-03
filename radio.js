var sig_gen = require('./sig_gen.js');
var modulator = require('./modulator.js');
var FFT = require('fft');
var windowing = require('fft-windowing');

function getPsd(centerFreq, span, resBw, vidBw, refLvl, scale) {
	var start = centerFreq - span / 2.0;
	var n = (span / resBw);
	var wave = Math.cos;
	var x = [];
	var y = [];
	for(var i = 0; i < n; i++) {
		x.push(start + i * resBw);
		y.push(wave(x[i] + phi) + randNormal(0, 0.05));
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

function tune(centerFreq, span, resBw, vidBw, refLvl, scale) {
	var start = centerFreq - span / 2.0;
	var n = (span / resBw);
	var t = [];
	n = 64;
	for(var i = 0; i < n; i++) {
		t.push(i);
		//t.push(1 / (start + i * resBw));
	}

	var A = 1;
	var carrier = sig_gen.cosine(A, 0.25, t, 0);
	var modWave = sig_gen.cosine(A, centerFreq / 10.0, t, Math.PI / 4.0);
	//var signal = modulator.am(carrier, modWave);
	signal = sig_gen.sinusoid(A, centerFreq, t, 0);

	// Set up FFT
	var fft = new FFT.complex(carrier.length, false);

	var reals = [];
	fft.simple(reals, carrier, 'real');

	var f = [];
	for (var i = 0; i < reals.length; i++) {
		f.push(i);
	}
	
	var psd = {
		refLvl: refLvl,
		scale: scale,
		resBw: resBw,
		vidBw: vidBw,
		freq: f,
		psd: reals,
	};

	return psd;
}

function getFFT(A, T, f, phi, n) {
	var t = [];
	for(var i = 0; i < n; i++) {
		t.push(i);
	}

	var signal = sig_gen.cosine(A, T*f, t, phi);
	//var signal = windowing.hann(signal);

	// Set up FFT
	var fft = new FFT.complex(signal.length, false);

	var reals = [];
	fft.simple(reals, signal, 'real');

	var complex = [];
	fft.simple(complex, signal, 'complex');

	var power = [];
	for (var i = 0; i < reals.length; i++) {
		var R = 0;
		if(!isNaN(reals[i]))
			R = Math.pow(reals[i], 2);

		var I = 0;
		if(!isNaN(complex[i]))
			I = Math.pow(complex[i], 2);

		var p = Math.sqrt(R + I);
		power.push(p);
	}

	var bins = [];
	for (var i = 0; i < reals.length; i++) {
		bins.push(i);
	}
	
	var data = {
		time: t,
		bins: bins,
		signal: signal,
		reals: reals,
		complex: complex,
		power: power
	};

	return data;
}

exports.getPsd = getPsd;
exports.tune = tune;
exports.getFFT = getFFT;