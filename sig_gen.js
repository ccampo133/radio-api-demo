function sinusoid(A, f, t, phi) {
    if(t instanceof Array) {
        var vals = [];
        for (var i = 0; i < t.length; i++)
            vals.push(A * Math.sin(2 * Math.PI * f * t[i] + phi));
        return vals;
    }
    else {
        return A * Math.sin(2 * Math.PI * f * t[i] + phi);
    }
}

function cosine(A, f, t, phi) {
    return sinusoid(A, f, t, phi + Math.PI / 2);
}

function square(A, f, t, phi) {
    var wave = sinusoid(a, f, t, phi);

    if(wave instanceof Array) {
        var vals = [];
        for (var i = 0; i < wave.length; i++)
            vals.push(Math.sign(wave[i]));
        return vals;
    }
    else {
        return Math.sign(wave);
    }
}

function randNormal(mu, sigma) {
    var u1 = Math.random();
    var u2 = Math.random();
    var normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mu + sigma * normal;
}

exports.sinusoid = sinusoid;
exports.cosine = cosine;
exports.square = square;
exports.randNormal = randNormal;