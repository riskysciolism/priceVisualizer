const itemModel = require('../models/itemModel');

async function getItems() {
    return await itemModel.find().exec();
}

async function getItemPrices(name) {
    let payload = {};
    await itemModel.findOne({name: name}).then(data => {
        let labels = [];
        let itemPrices = [];

        for(let i = 0; i < data.price.length; i++) {
            itemPrices.push(data.price[i].value);
            labels.push(data.price[i].timestamp);
        }
        payload = {
            labels: labels,
            datasets:[{
                label: name,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: itemPrices
            }]
        };
    }).catch(error => {
        console.log(error);
    });
    return payload;
}


function createItem(price, name, description, category) {
    console.log("Add Item");
    let newItem = new itemModel({
        name: name,
        description: description,
        category: category,
        price: [{
            value: price
        }]
    });

    newItem.save().then(data => {
        console.log(data);
    });
}

function updatePrice(name, price) {
    itemModel.findOneAndUpdate(
        {name: name},
        {
            $push: { 'item.price.value': price }
        },
        { safe: true }).exec().catch(error => console.log(error));
}

module.exports = {
    getItems: getItems,
    getItemPrices: getItemPrices,
    createItem: createItem,
    updatePrice: updatePrice
};