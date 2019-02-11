const category = require('../models/categoryModel');

function createCategory(request, response, next) {
    console.log("Add category");
    console.log(request.body);

    let requestData = request.body;
    let newCategory = new category(requestData);

    newCategory.save().then(data => response.json(data)).catch(next);
}

function getCategories(request, response, next) {
    category.find().then(data => {
        response.json(data);
    });
}

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories
};