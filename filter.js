/*
 * Calculates Kaiser windowed FIR filter coefficients for a single passband
 * based on "DIGITAL SIGNAL PROCESSING, II" IEEE Press pp 123-126.
 *
 * Fs: Sampling frequency.
 * Fa: Low freq ideal cut off (0 = low pass).
 * Fb: High freq ideal cut off (Fs/2 = high pass).
 * Att: Minimum stop band attenuation (>21dB).
 * M: Number of points in filter (ODD number).
 * H[]: Holds the output coefficients (they are symetric only half generated).
 */
function calcFilter(Fs, Fa, Fb, M, Att) {
    var Np = (M - 1) / 2;
    var A = [];
    var H = [];
    
    // Calculate the impulse response of the ideal filter
    A[0] = 2 * (Fb - Fa) / Fs;
    for (var j = 1; j <= Np; j++)
        A[j] = (Math.sin(2 * j * Math.PI * Fb / Fs) - Math.sin(2 * j * Math.PI * Fa / Fs)) / (j * Math.PI);

    // Calculate the desired shape factor for the Kaiser-Bessel window
    var Alpha;
    if (Att < 21)
        Alpha = 0;
    else if (Att > 50)
        Alpha = 0.1102 * (Att - 8.7);
    else
        Alpha = 0.5842 * Math.pow((Att - 21), 0.4) + 0.07886 * (Att - 21);

    // Window the ideal response with the Kaiser-Bessel window
    var Inoalpha = Ino(Alpha);
    for (var j = 0; j <= Np; j++)
        H[Np + j] = A[j] * Ino(Alpha * Math.sqrt(1 - (j * j / (Np * Np)))) / Inoalpha;

    for (var j = 0; j < Np; j++)
        H[j] = H[M - 1 - j];

    return H;
}

// Calculates the zeroth order Bessel function
function Ino(x) {
    var d = 0;
    var ds = 1
    var s = 1;

    do {
        d += 2;
        ds *= x * x / (d * d);
        s += ds;
    }
    while (ds > s * 1e-6);

    return s;
}

/*
 * Implements digital filtering by convolution with optional sub-sampled output.
 *
 * H[]: Holds the double sided filter coeffs, M = H.length (number of points in FIR).
 * ip[]: Holds input data (length > nPts + M).
 * nPts: The length of the required output data.
 * subSmp: The subsampling rate. subSmp = 8 means output every 8th sample.
 */
function convFilter(H, ip, nPts, subSmp) {
    var M = H.length;
    var sum = 0; // Accumulator
    var op = new Array(nPts);

    if ((subSmp == undefined) || (subSmp < 2))
      subSmp = 1;

    for (var j = 0; j < nPts; j++) {
        for (var i = 0; i < M; i++) {
            var k = (subSmp * j);

            if(k + i < nPts)
                sum += H[i] * ip[k + i];
            else
                sum = 0;
        }

        op[j] = sum;
        sum = 0;
    }

    return op;
}

exports.calcFilter = calcFilter;
exports.convFilter = convFilter;