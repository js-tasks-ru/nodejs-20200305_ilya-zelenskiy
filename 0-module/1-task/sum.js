function sum(a, b) {
  /* ваш код */
    if(!isAN(a) || !isAN(b)) {
        throw new TypeError();
    }
    return a + b;
}

function isAN(value) {
    if(value instanceof Number)
        value = value.valueOf();

    return  isFinite(value) && value === parseInt(value, 10);
}

module.exports = sum;
