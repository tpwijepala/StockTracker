const path = require("path");
const express = require("express");
// const window = require("window");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('events').EventEmitter.defaultMaxListeners = 20;

const scrapStock = require('./scrapStock');
const helper = require('./helper');

function main() {
    var stocks = [];
    var data = [];
    
    app.get("/", async (req, res) => {
        stocks = []
        data = {}
        
        var cookies = req.cookies;
        console.log("Retriving Stocks ...")
        var start = Date.now()
        
        await Promise.all(helper.getStocks(cookies)).then(values => {
            var n = values.length
            for (let i = 0; i < n; i++){
                data[values[i][0]] = values[i]
            }
        })
        
        var delta = Date.now() - start
        console.log("Time Taken: " + (delta/1000))

        console.log(data)
        res.render(path.dirname(__dirname) + '/index.html', {data:data});
        
    });

    // updating html
    app.post("/", async (req, res) => {
        const newStockAdd = req.body.stockAdd
        const stockDelete = req.body.stockDelete
        if (newStockAdd){
            if (!req.cookies[newStockAdd]) {
                console.log("adding new stock "+newStockAdd+" ...")
                const newStock = await scrapStock.scrap('https://ca.finance.yahoo.com/quote/'+newStockAdd);
                res.setHeader("set-cookie", [newStockAdd+"="+"https://ca.finance.yahoo.com/quote/"+newStockAdd]);
                
                data[newStockAdd] = newStock
                console.log(newStockAdd + " has been added")

            } else {
                console.log("Stock " + newStockName + " has already been added previously")
            }
        }
        if (stockDelete){
            if (req.cookies[stockDelete]) {
                res.clearCookie(stockDelete)
                delete data[stockDelete];
                console.log(stockDelete + " has been removed")

            } else {
                console.log("Stock " + stockDelete + " does not exist on the list")
            }
        }
        res.render(path.dirname(__dirname)+'/index.html', {data:data})
    });
    

    app.listen(5000, () => {
        console.log("listing on port 5000");
    });  
}

const app = express();
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

main()