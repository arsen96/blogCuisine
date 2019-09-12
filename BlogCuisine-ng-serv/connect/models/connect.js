const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const connectSchema = new mongoose.Schema({
   // _id:  mongoose.Schema.Types.ObjectId,
    nom:{type:String},
    prenom:{type:String},
    username: { type: String, index: true, unique: true, required: true },
    password: {type:String, required:true},
    uuid: {type:String},
    createdOn:{type:Date, default: Date.now},
    isAdmin:{type:Boolean,default:false},
})

connectSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', connectSchema)
