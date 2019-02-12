const itemModel = require('../models/itemModel');

async function getItems() {
    return await itemModel.find().exec();
}

async function getItemPrices(id) {
    let payload = {};
    await itemModel.findById(id).then(data => {
        let labels = [];
        let itemPrices = [];

        for(let i = 0; i < data.price.length; i++) {
            itemPrices.push(data.price[i].value);
            labels.push(data.price[i].timestamp);
        }
        payload = {
            labels: labels,
            datasets:[{
                label: data.name,
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

async function getNewestPrice(id) {
    console.log("get newest");
    let newestData = {};
    await itemModel.findById(id).then(data => {
        newestData = data.price[data.price.length - 1];
        console.log("Payload: " + newestData);
    }).catch(error => {
        console.log(error);
    });
    return newestData;
}

async function createItem(name, description, category, price) {
    console.log("Add Item");
    let newItem = await new itemModel({
        name: name,
        description: description,
        category: category,
        price: [{
            value: price
        }]
    });

    await newItem.save().then(data => {
        console.log(data);
    });
}

function updatePrice(id, price) {
    console.log("ID: " + id + ", Price: " +price);
    itemModel.findByIdAndUpdate(id,
        {
            $push: { 'price': {value: price} }
        },
        { safe: true, new: true}).exec().catch(error => console.log(error));

}

module.exports = {
    getItems: getItems,
    getItemPrices: getItemPrices,
    createItem: createItem,
    updatePrice: updatePrice,
    getNewestPrice: getNewestPrice
};