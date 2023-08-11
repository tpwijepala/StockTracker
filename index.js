const path = require("path");
const express = require("express");
// const window = require("window");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const scrapStock = require(__dirname+'/public/javascripts/scrapStock');
const helper = require(__dirname+'/public/javascripts/helper');
const searchURL = "https://ca.finance.yahoo.com/quote/"

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
                data[values[i][0]] = helper.extractString(values[i])
            }
        })
        
        var delta = Date.now() - start
        console.log("Time Taken: " + (delta/1000))

        console.log(data)
        res.render(__dirname + '/index.html', {data:data});
        
    });

    // updating html
    app.post("/", async (req, res) => {
        const stockAdd = req.body.stockAdd
        const stockDelete = req.body.stockDelete

        if (stockAdd){
            if (!req.cookies[stockAdd]) {
                const url = searchURL + stockAdd
                console.log("adding new stock "+stockAdd+" ...")
                const newStock = await scrapStock.scrap(stockAdd);
                res.setHeader("set-cookie", [stockAdd+"="+url]);
                
                data[stockAdd] = helper.extractString(newStock)
                console.log(stockAdd + " has been added")

            } else {
                console.log("Stock " + stockAdd + " has already been added previously")
            }
        }

        if (stockDelete){
            const url = req.cookies[stockDelete]
            if (url) {
                res.clearCookie(stockDelete)
                delete data[stockDelete];
                console.log(stockDelete + " has been removed")
            }
        }

        res.render(__dirname+'/index.html', {data:data})

    });
    

    app.listen(5000, () => {
        console.log("listing on port 5000");
    });  
}

const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

main()