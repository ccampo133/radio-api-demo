var sigGen = require('./sigGen.js');
var modulator = require('./modulator.js');
var fft = require('./fft.js');
var windowing = require('fft-windowing');
var filter = require('./filter.js');

function getPsd(centerFreq, span, resBw, vidBw, refLvl, scale, sigFreq) {
	var startFreq = centerFreq - span / 2.0;
	var NENBW = 1.5;
	var df = resBw / NENBW;
	var n = Math.ceil(span / df);
	var T = 1 / ( 2 * n * df); // Get sampling interval.

	var fftResult = getFFT(1, T, sigFreq, 0, n, startFreq);

	var psd = {
		refLvl: refLvl,
		scale: scale,
		resBw: resBw,
		vidBw: vidBw,
		freq: fftResult.freq,
		psd: fftResult.psd,
		power: fftResult.power
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
	var noise = sigGen.noise(0, A/1000, n);
	var signal = sigGen.sinusoid(A, f, t, phi);
	signal = sigGen.add([signal, noise]);

	// Heterodyne with LO signal to shift the DFT to the specified start frequency
	if(startFreq != 0)
		signal = sigGen.multiply([signal, sigGen.sinusoid(1, startFreq, t, 0)]);

	// Anti-alias filter
	//var FIRCoeff = filter.calcFilter(1/T, startFreq, 40, 31, -150);
	//signal = filter.convFilter(FIRCoeff, signal, n, 1);
	
	// Apply window
	signal = windowing.hann(signal);
	var NENBW = 1.5; // Hann window normalized equivalent noise bandwidth

	// Subtract DC offset
	var avg = 0;
	for (var i = 0; i < n; i++)
		avg += signal[i];
	avg /= n;

	for (var i = 0; i < n; i++)
		signal[i] -= avg;

	// Compute the FFT in place
	var reals = signal.slice(0);
	var imag = new Array(n);
	for (var i = 0; i < n; i++) 
		imag[i] = 0;
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
		psd[i] = 10 * Math.log(P / (df * NENBW)) / Math.LN10;
		freq[i] = startFreq + i * df;
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