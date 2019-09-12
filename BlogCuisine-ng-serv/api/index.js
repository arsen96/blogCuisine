const express = require('express');
const router = express.Router();
const Recetteposts = require('./models/recetteposts')
const Favorisposts = require('./models/favoris')
const multer = require('multer');
const User = require('../connect/models/connect');
const mongoose = require('mongoose')

router.post('/recettes-posts', (req, res, next) => {
    console.log("uusssseerrr reeeeeqqqqq seesssioonn",req.user.user);

    const user = new User({
        _id: req.user.user,
    })

    user.save(function(err){
       // if (err) console.log("Utilisaateeeeuuurrr erreeuurr possstt");
   
    const recettePosts = new Recetteposts({
        _id: new mongoose.Types.ObjectId(),
        nom:req.body.nom,
        image:req.body.image,
        ingredients:req.body.ingredients,
        preparation:req.body.preparation,
        description:req.body.description,
        tempsPreparation:req.body.tempsPreparation,
        tempsCuisson:req.body.tempsPreparation,
        uuid:req.body.uuid,
        parAdmin:req.body.parAdmin,
        auteur:user._id
    });

    recettePosts.save((err, data) => {
        
        if (err) return res.status(500).json(err)
        res.status(200).json(data)
    })
})
})
/*

router.post('/favoris', (req, res, next) => {
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
*/


//Tous les posts
router.get('/recettes-posts', (req, res) => {
    Recetteposts.find(req.body).populate('auteur').then(data => {
        res.status(200).json(data)
    })
})

lastUploadedImageName = '';

const storage = multer.diskStorage({
    // destination: 'assets/images',
    destination: '../BlogCuisineFront/src/assets/images',
    filename: function (req, file, callback) {
        lastUploadedImageName = file.originalname;
        callback(null, lastUploadedImageName)
    }
})

const upload = multer({ storage: storage });

//Poster Image
router.post('/img', upload.single('file'), (req, res) => {
    console.log(`assets/images/` + req.file.originalname);
    res.status(201).json({
        url: `assets/images/` + req.file.originalname
    })
})

let lastUploadedImageCouvertureName = '';

const storagecouverture = multer.diskStorage({
    // destination: 'assets/images',
    destination: './uploads/',
    filename: function (req, file, callback) {
        lastUploadedImageCouvertureName = file.originalname;
        callback(null, lastUploadedImageCouvertureName)
    }
})

const uploadcouverture = multer({ storage: storagecouverture });

//Route spécifique
router.post('/recettes-posts/imagecouverture', uploadcouverture.single('image'), (req, res) => {
    if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return res.status(400).json({ msg: 'Seul les images files sont autorisés' })
    }
    res.status(201).send({ filename: req.file.filename, file: req.file })
})

//Route spécifique
router.get('/recettes-posts/imagecouverture', (req, res) => {
    res.status(201).send('dsf')
})


//Posts by id
router.get('/recettes-posts/:id', (req, res) => {
    const identifiant = req.params.id

    Recetteposts.findById(identifiant).populate('auteur').then(post => res.status(200).json(post))
        .catch(err => res.status(500).json({
            message: 'blog post avec identifiant ' + identifiant + " n'a pas été trouvé ",
            error: err
        }))
})


//Update a Post 
router.put('/recettes-posts/:id', (req, res) => {
    const id = req.params.id;
    Recetteposts.findOneAndUpdate({ _id: id }, { $set: { ...req.body } }, (err, data) => {
        if (err) return res.status(500).json({ msg: "La modification n'a pas pu faire", error: err })
        res.status(200).json({ msg: `document avec id ${id} a été mis à jour`, reponse: data })
    })
})



router.get('/img', (req, res) => {
    res.send(req.body)

})


//Delete a post
router.delete('/recettes-posts/:id', (req, res) => {
    const identifiant = req.params.id;
    Recetteposts.findByIdAndDelete(identifiant).then(post => {
        res.status(200).json(post)
    })
        .catch(err => res.status(500).json({
            message: `Blog post avec id ${identifiant} n'a pas été trouvé`,
            error: err
        }))
})

/**** POST USER */

router.get('/userdashboard', function(req, res) {
    
    Recetteposts.find( (err, posts) => {
       if(err) {
         console.log(err);
         //{...req.user.id},
       } else {
      /* postTargeted = [];
            posts.forEach(element => {
                if(req.user.user == element.auteur){
                      postTargeted.push(element)
                }
            });*/
            res.send({allusers:req.session.allusers, posts: posts});
       }
    });
})




module.exports = router;