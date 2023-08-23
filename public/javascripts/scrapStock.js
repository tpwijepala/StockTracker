const puppeteer = require('puppeteer')
const searchURL = "https://ca.finance.yahoo.com/quote/";

async function getName(page) {
    // Stock Name
    var element = await page.waitForXPath('//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1');
    var nameVal = await page.evaluate(element => element.textContent, element);

    return nameVal;
}

async function getPrice(page) {
    // Current Stock Prices
    var element = await page.waitForXPath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[1]');
    const priceVal = await page.evaluate(element => element.textContent, element);

    return priceVal;
   
}

async function getAdjustment(page) {
    // Stock Price Adjustments
    var element = await page.waitForXPath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[2]/span');
    const adjVal = await page.evaluate(element => element.textContent, element);

    return adjVal;
}

async function getAdjPercent(page) {
    // Stock Price Adjustments in percentage
    var element = await page.waitForXPath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[3]/span');
    const perVal = await page.evaluate(element => element.textContent, element);

    return perVal
}

async function scrapStock(stockName) {
    var url = searchURL + stockName;

    const browser = await puppeteer.launch({headless: "old"});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(150000);
    await page.goto(url, {waitUntil: "domcontentloaded",});
    
    // attempt @ searching for stock
    // await page.type('', stock);
    // const searchResultSelector = search-box__link';
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);
    
    ret = await Promise.all(
        [stockName, getName(page), getPrice(page), getAdjustment(page), getAdjPercent(page)]
        )
    browser.close();

    // console.log(ret)
    return ret;
}

exports.scrap = scrapStock;
