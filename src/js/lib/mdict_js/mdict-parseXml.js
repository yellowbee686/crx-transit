module.exports = function (str) {
    return (new DOMParser()).parseFromString(str, 'text/xml');
}
