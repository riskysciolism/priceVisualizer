const rp = require('request-promise');
const apiKEY = require('config.js').apiKey;
const currency = 'EUR';
const category = 'Coin';
const itemModel = require('../models/itemModel');
const categoryModel = require('../models/categoryModel');
const itemController = require('../controller/itemController');

async function getCategoryId(name) {
    await categoryModel.findOne({name: name}, '_id').then(async data => {
        console.log(data._id);
        return data._id;
    }).catch(error => {
        console.log(error);
    });
}

async function callAPI(){
    console.log("Calling API..");
    // First we need to find out which Coins need to be asked for.
    let coinsToPullName = [];
    let coinsToPullId = [];
    await itemModel.find({category: await getCategoryId(category)}).then(data =>  {
        for(let i = 0; i < data.length; i++) {
            coinsToPullName.push(data[i].name);
            coinsToPullId.push(data[i]._id)
        }
        console.log("Coins to pull: " + coinsToPullName);
    }).catch(error => {
       console.log(error);
    });

    //API requests for coins which need to be pulled
    for(let i = 0; i < coinsToPullName.length; i++) {
        let currentCoin = coinsToPullName[i];
        let currentId = coinsToPullId[i];
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
            qs: {
                symbol: currentCoin,
                convert: currency
            },
            headers: {
                'X-CMC_PRO_API_KEY': apiKEY
            },
            json: true,
            gzip: true
        };

        rp(requestOptions).then(async response => {
            let price = response.data[currentCoin].quote[currency].price;
            console.log('API call response for ' + currentCoin + ':', response.data[currentCoin].quote[currency]);
            itemController.updatePrice(currentId, price);
        }).catch((err) => {
            console.log('API call error:', err.message);
        });
    }
}
setInterval(callAPI, 10000/*3600000/4*/);