
const scrapStock = require('./scrapStock');

function getStocks(cookies) {
    const ret = []
    for (var cookie in cookies) {
        ret.push(scrapStock.scrap(cookie))
    }
    return ret;
}

exports.getStocks = getStocks