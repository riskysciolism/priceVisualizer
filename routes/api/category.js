let router = require('express').Router(),
    category = require('../../controller/categoryController');

router.route('/')
    .post(category.createCategory)
    .get(category.getCategories);

module.exports = router;