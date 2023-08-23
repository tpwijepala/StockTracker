
const { extractStockInfo } = require('./scrapStock');

/**
 * Gets current info of each stock
 * @param {Cookies} stockTickers 
 * @returns {Array<Array<string>>} 2D array of Stock Info
 */

function retrieveStockInfo(stockTickers) {
    const ret = []
    for (var stockTicker in stockTickers) {
        ret.push(extractStockInfo(stockTicker))
    }
    return ret;
}

exports.retrieveStockInfo = retrieveStockInfo