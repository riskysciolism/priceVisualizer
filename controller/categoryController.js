const category = require('../models/categoryModel');

function createCategory(request, response, next) {
    console.log("Add category");
    console.log(request.body);

    let requestData = request.body;
    let newCategory = new category(requestData);

    newCategory.save().then(data => response.json(data)).catch(next);
}

function getCategories() {
    category.find().then(data => {
        return data;
    });
}

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories
};