var sig_gen = require('./sig_gen.js');
var modulator = require('./modulator.js');
var fft = require('./fft.js');
var windowing = require('fft-windowing');

function getPsd(centerFreq, span, resBw, vidBw, refLvl, scale) {
	var start = centerFreq - span / 2.0;
	var n = (span / resBw);
	var wave = Math.cos;
	var x = [];
	var y = [];
	for (var i = 0; i < n; i++) {
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

function getFFT(A, T, f, phi, n, startFreq) {
	var t = new Array(n);
	var bins = new Array(n);
	for (var i = 0; i < n; i++) {
		t[i] = i * T;
		bins[i] = i;
	}

	// Generate the signal
	var signal = sig_gen.sinusoid(A, f, t, phi);
	signal = windowing.hann(signal);

	var reals = signal.slice(0);
	var imag = new Array(n);
	for (var i = 0; i < imag.length; i++) {
		imag[i] = 0;
	}

	// Compute the FFT in place
	fft.transform(reals, imag);

	// Get the single-sided power spectrum in dB and the corresponding frequencies
	var power = new Array(Math.floor(n/2));
	var freq = new Array(Math.floor(n/2));
	for (var i = 0; i < power.length; i++) {
		var R = Math.pow(reals[i], 2);
		var I = Math.pow(imag[i], 2);
		power[i] = 2* 10 * Math.log((R + I) / Math.pow(n/2, 2)) / Math.log(10);
		freq[i] = i * (1 / (n * T));
	}

	var data = {
		time: t,
		freq: freq,
		bins: bins,
		signal: signal,
		power: power,
		reals: reals,
		imag: imag
	};

	return data;
}

exports.getPsd = getPsd;
exports.getFFT = getFFT;