const item = require('../models/itemModel');

function getItemPrices(request, response, next) {
    let payload;
    item.find({name: request.query.name}).then(data => 
        /*
        payload = {
            labels: data.price.timestamp,
            datasets:[{
                label: data.name,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data.price.value
            }]
        },
        */
        response.json(data));
}

function createItem(request, response, next) {
    console.log("Add Item");
    let requestData = request.body;
    let newItem = new item(requestData);
    
    newItem.save().catch(next);
    response.json({success : true});
}

module.exports = {
    getItemPrices: getItemPrices,
    createItem: createItem
};