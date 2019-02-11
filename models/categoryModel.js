let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const category = new Schema({
        name: String,
        description: String,
    },
    {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 1000
        }
    });

module.exports = mongoose.model('category', category);