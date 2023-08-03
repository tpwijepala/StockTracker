
const scrapStock = require('./scrapStock');

function getStocks(cookies) {
    const ret = []
    for (var cookie in cookies) {
        ret.push(scrapStock.scrap("https://ca.finance.yahoo.com/quote/"+cookie))
    }
    return ret;
}

function concatArray(arr) {
    const n = arr.length
    var ret = ""
    if (n == 0) {return ret}

    ret = ret.concat(arr[0])
    for (var i = 1; i < n; i++) {
        ret = ret.concat(", " + arr[i])
    }
    return ret
}

exports.getStocks = getStocks
exports.concatArray = concatArray