let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const item = new Schema({
    name: String,
    description: String,
    category: ObjectId,
    price:[{
        value: Number,
        timestamp: {
           type: Date,
           default: Date.now
        } 
    }]
},
{
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});

module.exports = mongoose.model('item', item);