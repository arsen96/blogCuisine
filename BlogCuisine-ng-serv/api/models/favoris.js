
const mongoose = require('mongoose');

Connect = require('../../connect/models/connect'),
connectSchema = mongoose.model('User').schema


Recette = require('../models/recetteposts'),
recetteSchema = mongoose.model('RecettePosts').schema

const favorisSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postliked: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"RecettePosts",
    },
    userliked: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    addedOn:{type:String,default:new Date()}
  })

  module.exports = mongoose.model('Favoris',favorisSchema)