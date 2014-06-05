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
	//var signal = sig_gen.sinusoid(A, f, t, phi);
	var carrier = sig_gen.sinusoid(A, f, t, phi);
	var modfunc = sig_gen.cosine(A/4, f/10, t, phi);
	modfunc = sig_gen.add([modfunc, sig_gen.cosine(A/4, f/15, t, phi)]);
	var signal = modulator.am(carrier, modfunc);
	signal = sig_gen.add([signal, sig_gen.noise(0, 0.01, n)]);
	//signal = windowing.hann(signal);

	var reals = signal.slice(0);
	var imag = new Array(n);
	for (var i = 0; i < imag.length; i++) {
		imag[i] = 0;
	}

	// Compute the FFT in place
	fft.transform(reals, imag);

	// Get the single-sided power spectrum in dB and the corresponding frequencies
	var n2 = (n % 2) == 0 ? 1 + (n / 2) : (n + 1) / 2; 

	var power = new Array(n2);
	var freq = new Array(n2);
	for (var i = 0; i < n2; i++) {
		var R = Math.pow(2 * reals[i], 2);
		var I = Math.pow(2 * imag[i], 2);
		var P = (R + I) / Math.pow(n2, 2);
		power[i] = 10 * Math.log(P) / Math.log(10);
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