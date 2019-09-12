
const express = require('express');
const app = express();
var cors = require('cors');
const index = require('./api/index')
const favoris = require('./api/indexFavoris')
const connect = require('./connect/index')
const mongoose = require('mongoose');
const User = require('./connect/models/connect')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const connection = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))


/****Passport ******/

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;


//Vérifier que la requete entrante vient d'un user authentifié
app.use(cookieParser());
//Disposer un sesssion
app.use(session({
    secret: 'secretUserConnectedOnWebsite',
    resave:true,
    saveUninitialized:true,
    name: "blog-kitchen"
}))

//Fonction iniialize permettant de disposer de se loguer/ de se déconecter etc ...
app.use(passport.initialize())
app.use(passport.session());

// Ajouter un utilisateur dans la session (cookie)
passport.serializeUser((user,cb) => {
    cb(null,user);
});

//Récuperer l'utilisateur depuis la session (cookie)
passport.deserializeUser((user,cb) => {
   // console.log('cookiee-User',user)
    cb(null,user)
    
})


/////////////////////Création de strategy Passport pour l'authentification
passport.use(new Strategy({
    session:true,
    usernameField: 'username',
    passwordField: 'password',
    uuidField: 'uuid'
},(name,pwd,cb) => {
    
    //check si le user existe avec le champs username 
    User.findOne({username : name},{password:pwd}, (err,user) => {
      
        
        if(err){
            console.log("L'utilisateur avec le nom "+ name + " n'a pas pu être trouvé");
        }
        if(!user){
            console.log('Utilisateur introuvable',user);
            
           return cb(null,"Les données saisies sont erronées")
        }
        if(user && user.password !== pwd){
           //console.log("fauxxx mot de passe", user);
            //cb(null,false)
           return cb(null, 'Le mot de passe est incorrecte');
        }
            //let payload = {subject : user._id}
            //let token = jwt.sign(payload, 'secretKey')
            cb(null,{user: user._id, username:name,password:pwd}); 
    })
}))



app.set('port', (process.env.port || 3000))


app.use(cors({credentials:true,origin:'http://localhost:4200'}));

const uploadsDir = require('path').join(__dirname,'/uploads');
app.use(express.static(uploadsDir));

app.use('/auth', connect)
app.use('/api', index)
app.use('/api', favoris)


//Mongoose
mongoose.connect('mongodb://localhost:27017/recettesBlog', { useNewUrlParser: true });
connection.on('error', (err) => {
    console.log('connection to MongoDb error: ' + err.message);
});

connection.once('open', () => {
    console.log('Connected to MongoDB');

    app.listen(app.get('port'), () => {
        console.log(`Serveur ecoute sur le port ${app.get('port')}`);
    })
})