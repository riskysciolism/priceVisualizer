let router = require('express').Router(),
    items = require('../../controller/itemController');

router.route('/')
    .get(items.getItemPrices)
    .post(items.createItem);

module.exports = router;