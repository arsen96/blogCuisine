const mongoose = require('mongoose');

Connect = require('../../connect/models/connect'),
connectSchema = mongoose.model('User').schema


const recetteSchema = new mongoose.Schema({
 //_id:  mongoose.Schema.Types.ObjectId,
  nom: {type:String},//,required:true
  image:String,
  ingredients: String,  
  preparation: String,
  description: String,  
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  /*favoris:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },*/
  tempsPreparation: Number,
  tempsCuisson: Number,
  parAdmin:Boolean,
  uuid:String,
 // categorie:[categorieSchema],
  createdOn: { type: Date, default:Date.now},  
});

module.exports = mongoose.model('RecettePosts',recetteSchema)
