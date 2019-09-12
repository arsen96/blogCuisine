const express = require('express');
const router = express.Router();
const Favorisposts = require('./models/favoris')
const User = require('../connect/models/connect');
const mongoose = require('mongoose')



router.post('/favoris/:id', (req, res, next) => {
    console.log("uusssseerrr reeeeeqqqqq seesssioonn",req.params);
    const user = new User({
        _id: req.user.user,
    })

    const favorisPost = new Favorisposts({
        _id: new mongoose.Types.ObjectId(),
         userliked:user._id,
        postliked:req.params.id
    });

    favorisPost.save((err, data) => {
        console.log("favorriss ajoutééé",data);
        
        if (err) return res.status(500).json({msg:err})
        res.status(200).json(data)
    })
    
})


router.get('/favoris', (req, res) => {
    Favorisposts.find(req.body).sort([['addedOn', 'descending']]).populate('userliked').populate('postliked').then(data => {
        res.status(200).json(data)
    }) 
})

//Supprimer un article favoris

router.delete('/favoris/:id',(req,res) => {

    console.log("yyyyyyyeeeeessss");
    
    const identifiant = req.params.id;
    Favorisposts.findByIdAndDelete(identifiant).then(post => {
        res.status(200).json({success:"L'article a été supprimé de vos favoris"})
    })
    .catch(err => res.status(500).json({
        failed: `Article favoris avec id ${identifiant} n'a pas été trouvé`,
    }))
})



module.exports = router;