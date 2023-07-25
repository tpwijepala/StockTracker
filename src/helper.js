
const scrapStock = require('./scrapStock');

function getStocks(cookies) {
    const ret = []
    for (var cookie in cookies) {
        ret.push(scrapStock.scrap(cookies[cookie]))
    }
    return ret;
}

exports.getStocks = getStocks