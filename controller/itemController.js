const item = require('../models/itemModel');

function getItems() {
    item.find().then(data =>
        {
            return JSON(data);
        }
    );
}

function getItemPrices(name) {
    item.findOne({name: name}).then(data => {
        let labels = [];
        let itemPrices = [];

        for(let i = 0; i < data.price.length; i++) {
            itemPrices.push(data.price[i].value);
            labels.push(data.price[i].timestamp);
        }

        let payload = {
            labels: labels,
            datasets:[{
                label: data.name,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: itemPrices
            }]
        };

        return payload;
    })
}


async function createItem(request, response, next) {
    console.log("Add Item");
    console.log(request.body.price);

    let requestData = request.body;
    let newItem = new item({
        name: requestData.name,
        description: requestData.description,
        category: requestData.category,
        price: [{
            value: requestData.price
        }]
    });

    await newItem.save().then(data => {
        response.json(data)
    });
}

function updatePrice(name, price) {
    item.findOneAndUpdate(
        {name: name},
        {
            $push: { 'item.price.value': price }
        },
        { safe: true }).exec().catch(error => console.log(error));
}

module.exports = {
    getItems: getItems,
    getItemPrices: getItemPrices,
    createItem: createItem
};