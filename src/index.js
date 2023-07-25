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
        data = []
        
        var cookies = req.cookies;
        var start = Date.now()

        await Promise.all(helper.getStocks(cookies)).then(values => {
            var n = values.length
            for (let i = 0; i < n; i++){
                data.push({
                    stock:values[i]
                })
            }
        })
        
        var delta = Date.now() - start
        console.log("Time Taken: " + (delta/1000))

        console.log(data)
        res.render(path.dirname(__dirname) + '/index.html', { data: data});
        
    });

    // updating html
    app.post("/", async (req, res) => {
        const newStockName = req.body.stock
        if (!req.cookies[newStockName]) {
            const newStock = await scrapStock.scrap('https://ca.finance.yahoo.com/quote/'+newStockName);
            res.setHeader("set-cookie", [newStockName+"="+"https://ca.finance.yahoo.com/quote/"+newStockName]);
            
            data.push({
                stock: newStock
            })
            console.log(newStock)

        } else {
            console.log("Stock " + newStockName + " has already been added previously")
        }

        res.render(path.dirname(__dirname)+'/index.html', {data: data})
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