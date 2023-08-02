
const scrapStock = require('./scrapStock');

function getStocks(cookies) {
    const ret = []
    for (var cookie in cookies) {
        ret.push(scrapStock.scrap("https://ca.finance.yahoo.com/quote/"+cookie))
    }
    return ret;
}

exports.getStocks = getStocks