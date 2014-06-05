var sigGen = require('./sigGen.js');
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
	var noise = sigGen.noise(0, A/100, n);
	//var carrier = sigGen.sinusoid(A, f, t, phi);
	//var modwave = sigGen.cosine(A/2, f/5, t, phi);
	//var signal = modulator.am(carrier, modwave);
	var signal = sigGen.sinusoid(A, f, t, phi);
	signal = sigGen.add([signal, noise]);
	signal = windowing.hann(signal);

	var reals = signal.slice(0);
	var imag = new Array(n);
	for (var i = 0; i < imag.length; i++) {
		imag[i] = 0;
	}

	// Compute the FFT in place
	fft.transform(reals, imag);

	// Get the single-sided power spectrum in dB and the corresponding frequencies
	var n2 = (n % 2 == 0) ? (n / 2) + 1 : (n + 1) / 2;
	var df = 1 / (n * T); // Frequency resolution (bin bandwidth)
	var power = new Array(n2);
	var psd = new Array(n2);
	var freq = new Array(n2);
	for (var i = 0; i < n2; i++) {
		var R2 = Math.pow(reals[i], 2);
		var I2 = Math.pow(imag[i], 2);
		var P = 2 * (R2 + I2) / Math.pow(n, 2);
		power[i] = 10 * Math.log(P) / Math.LN10; // Convert to dB
		psd[i] = power[i] - (10 * Math.log(df) / Math.LN10); // TODO: df should be ENBW of window if it is used.
		freq[i] = i * df;
	}

	var data = {
		time: t,
		freq: freq,
		bins: bins,
		signal: signal,
		power: power,
		psd: psd,
		reals: reals,
		imag: imag
	};

	return data;
}

exports.getPsd = getPsd;
exports.getFFT = getFFT;