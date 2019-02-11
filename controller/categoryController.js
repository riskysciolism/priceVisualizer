const category = require('../models/categoryModel');

function createCategory(name, description) {
    console.log("Add category");
    let requestData = {
      name: name,
      description: description
    };

    let newCategory = new category(requestData);

    newCategory.save().then(data => console.log(data)).catch(error);
}

function getCategories() {
    category.find().then(data => {
        console.log(data);
        return data;
    });
}

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories
};