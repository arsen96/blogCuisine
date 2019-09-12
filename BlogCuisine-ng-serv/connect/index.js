const express = require('express');
const router = express.Router();
const User = require('./models/connect');
const passport = require('passport')
const jwt = require('jsonwebtoken')
const uuidv1  = require('uuid/v1');



router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username, password:req.body.password, uuid: uuidv1(), nom:req.body.nom, prenom:req.body.prenom, isAdmin:req.body.isAdmin})
    newUser.save((error, data) => {
        if (error) {
            res.status(500).json(error);
        }
        //Fonction Login fournit par passport
        // Apres le login on a la fonction req.user disponible partout pour nos requetes
        req.login(req.body,(error) => {
            if(error){
                console.log("Une erreur lors de l'authentification req.log",error);
            }
            else{
                res.status(200).json({data}) //{msg: data}
            }
        })
    })
})


//Get Users
router.get('/register', (req, res) => {

    User.find((error, data) => {
        if (error) {
            res.status(500).json(err);
        }

        req.session.allusers = data;
        res.status(200).send(data)
    })
})


//Delete a User
router.delete('/register/:id', (req, res) => {
    const identifiant = req.params.id;
    User.findByIdAndDelete(identifiant).then(post => {
        res.status(200).json(post)
    })
        .catch(err => res.status(500).json({
            message: `Utilisateur avec id ${identifiant} n'a pas été trouvé`,
            error: err
        }))
})

//Delete Many Users
router.delete('/registers', (req,res) => {
    const ids = req.query.ids;
   console.log('query ids',ids);
  const allIds = ids.split(',').map(id => {
       return id
   })
   
   const condition = {_id: {$in: allIds}}
   User.deleteMany(condition, (err,result) => {
       if(err){
           return res.status(500).json(err);
       }
       //result retourne le nb élèment qui ont été supprimé et bool
       res.status(202).json(result);
   });
});

//Authentifié
router.post('/login', function(req,res,next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            console.log("Emmmaaaiilll et mooot ddeeee passsseee incorectes");
            return next(err);
         }
         if (!user) {  return next(user);  }
         
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          if(user){

            User.find((error, data) => {
                if (error) {
                    res.status(500).json(err);
                }
                
                req.session.allusers = data;
            })

            User.findOne({username : req.user.username},(err,data) => {
                obj = {
                    data,
                    user
                }

                //req.session.userinfos = obj.data

                console.log("session once logged",req.session.passport.user);

                res.status(200).send(obj)
            })

          }
        });
      })(req, res, next);
});



// Obtenir l'utilisateur connecté par son identifiant

router.get('/connected',(req,res) => {
    console.log("espace personnel",req.session.passport.user);
    
    res.status(200).send(req.session.passport.user);
})

router.get('/logout',(req,res) => {
    //Methode de passport pour deloguer
    req.logOut();
    res.status(200).json({msg:'Vous vous êtes déconnecté du site'});
})




module.exports = router;