function sinusoid(A, f, t, phi, offset, mu, sigma) {
    if (typeof(offset) === 'undefined')
        offset = 0;

    if (typeof(mu) === 'undefined')
        mu = 0;

    if (typeof(sigma) === 'undefined') 
        sigma = 0;

    if (t instanceof Array) {
        var vals = [];
        for (var i = 0; i < t.length; i++) {
            var y = A * Math.sin(2 * Math.PI * f * t[i] + phi) + offset + randNormal(mu, sigma);
            vals.push(y);
        }
        return vals;
    }
    else {
        var y = A * Math.sin(2 * Math.PI * f * t + phi) + offset + randNormal(mu, sigma);
        return y;
    }
}

function cosine(A, f, t, phi, offset, mu, sigma) {
    return sinusoid(A, f, t, phi + Math.PI / 2, offset, mu, sigma);
}

function square(A, f, t, phi) {
    var wave = sinusoid(a, f, t, phi);

    if (wave instanceof Array) {
        var vals = [];
        for (var i = 0; i < wave.length; i++)
            vals.push(Math.sign(wave[i]));
        return vals;
    }
    else {
        return Math.sign(wave);
    }
}

function boxcar(A, a, b, x) {
    if (x instanceof Array) {
        var vals = [];
        for (var i = 0; i < x.length; i++) {
            var y0 = (x[i] - a) < 0 ? 0 : 1;
            var y1 = (x[i] - b) < 0 ? 0 : 1;
            vals.push(A * (y0 - y1));
        }
        return vals;
    }
    else {
        var y0 = (x - a) < 0 ? 0 : 1;
        var y1 = (x - b) < 0 ? 0 : 1;
        return A * (y0 - y1);
    }
}

function noise(mu, sigma, n) {
    var vals = new Array(n);
    for (var i = 0; i < n; i++)
        vals[i] = randNormal(mu, sigma);
    return vals;
}

function randNormal(mu, sigma) {
    var u1 = Math.random();
    var u2 = Math.random();
    var normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mu + sigma * normal;
}

function add(signals) {
    var signal = [];
    for (var i = 0; i < signals.length; i++) {
        var curSig = signals[i];
        if (i == 0) {
            signal = curSig.slice(0);
        }
        else {
            for (var j = 0; j < signal.length; j++)
                signal[j] += curSig[j];
        }
    }
    return signal;
}

function multiply(signals) {
    var signal = [];
    for (var i = 0; i < signals.length; i++) {
        var curSig = signals[i];
        if (i == 0) {
            signal = curSig.slice(0);
        }
        else {
            for (var j = 0; j < signal.length; j++)
                signal[j] *= curSig[j];
        }
    }
    return signal;
}

exports.sinusoid = sinusoid;
exports.cosine = cosine;
exports.square = square;
exports.randNormal = randNormal;
exports.boxcar = boxcar;
exports.add = add;
exports.noise = noise;
exports.multiply = multiply;