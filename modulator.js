function am(carrierWave, modWave) {
    var signal = [];
    for (var i = 0; i < modWave.length; i++) {
        y = (1 + modWave[i]) * carrierWave[i];
        signal.push(y);
    }
    return signal;
}

exports.am = am;