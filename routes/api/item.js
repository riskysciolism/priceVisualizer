let router = require('express').Router(),
    item = require('../../controller/itemController');

router.route('/')
    .get(item.getItems)
    .post(item.createItem);

router.route('/:id')
    .get(item.getItemPrices);

module.exports = router;