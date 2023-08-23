const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { extractStockInfo } = require(__dirname+'/public/javascripts/scrapStock');
const { retrieveStockInfo } = require(__dirname+'/public/javascripts/getStockData');
const searchURL = "https://ca.finance.yahoo.com/quote/"

function main() {
    var stockInfo = {};
    
    // retieving stock info using the list of stocks
    app.get("/", async (req, res) => {
        stockInfo = {}
        
        var stockTickers = req.cookies;
        console.log("Retriving Stocks ...")
        var start = Date.now()
        
        await Promise.all (
            retrieveStockInfo(stockTickers) 
        ).then(stocks => {
            var n = stocks.length
            for (let i = 0; i < n; i++) {
                stockInfo[stocks[i][0]] = stocks[i]
            }
        })
        
        var delta = Date.now() - start
        console.log("List of Stocks: [" + Object.keys(stockInfo).join(', ') + "]")
        console.log("Time Taken: " + (delta/1000) + '\n')

        res.render(__dirname + '/index.html', {stockInfo:stockInfo});
    });

    // adding/removing stocks from current list of stocks
    app.post("/", async (req, res) => {
        const stockAdd = req.body.stockAdd
        const stockDelete = req.body.stockDelete

        if (stockAdd) {
            if (!req.cookies[stockAdd]) {
                const url = searchURL + stockAdd
                console.log("adding new stock " + stockAdd + " ...")

                const newStock = await extractStockInfo(stockAdd);

                res.setHeader("set-cookie", [stockAdd+"="+url]);
                stockInfo[stockAdd] = newStock

                console.log(stockAdd + " has been added\n")

            } else {
                console.log("stock " + stockAdd + " has already been added previously\n")
            }
        }

        if (stockDelete) {
            const url = req.cookies[stockDelete]

            if (url) {
                res.clearCookie(stockDelete)
                delete stockInfo[stockDelete];

                console.log(stockDelete + " has been removed\n")
            }
        }

        res.render(__dirname+'/index.html', {stockInfo:stockInfo})
    });

    // setting up a connection
    app.listen(5000, () => {
        console.log("listing on port 5000\n");
    });  
}

// setting up app
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

main()