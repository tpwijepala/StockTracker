
const scrapStock = require('./scrapStock');

function getStocks(cookies) {
    const ret = []
    for (var cookie in cookies) {
        ret.push(scrapStock.scrap(cookie))
    }
    return ret;
}

function extractString(arr) {
    const n = arr.length
    var ret = ""
    if (n == 0) {return ret}

    for (var i = 1; i < (n-1); i++) {
        ret = ret.concat(arr[i] + ", ")
    }
    ret = ret.concat(arr[n-1])
    return ret
}

exports.getStocks = getStocks
exports.extractString = extractString