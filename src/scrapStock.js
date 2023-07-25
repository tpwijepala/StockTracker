const puppeteer = require('puppeteer')

async function getName(page) {
    // Stock Name
    const [nameEl] = await page.$x('//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1');
    const nameProp = await nameEl.getProperty('textContent');
    const nameVal = await nameProp.jsonValue();

    return nameVal;
}

async function getPrice(page) {
    // Current Stock Prices
    const [priceEl] = await page.$x('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[1]');
    const priceProp = await priceEl.getProperty('textContent');
    const priceVal = await priceProp.jsonValue();

    return priceVal;
   
}

async function getAdjustment(page) {
    // Stock Price Adjustments
    const [adjEl] = await page.$x('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[2]/span');
    const adjProp = await adjEl.getProperty('textContent');
    const adjVal = await adjProp.jsonValue();

    return adjVal;
}

async function getAdjPercent(page) {
    // Stock Price Adjustments in percentage
    const [perEl] = await page.$x('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[3]/span');
    const perProp = await perEl.getProperty('textContent');
    const perVal = await perProp.jsonValue();

    return perVal
}

async function scrapStock(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(150000);
    await page.goto(url, {waitUntil: "domcontentloaded",});
 
    ret = await Promise.all(
        [getName(page), getPrice(page), getAdjustment(page), getAdjPercent(page)]
        )
    browser.close();

    // console.log(ret)
    return ret;
}

exports.scrap = scrapStock;
