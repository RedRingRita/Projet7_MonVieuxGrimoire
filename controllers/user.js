const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message : "Erreur lors de l'inscription", error: error.message }));
      })
      .catch(error => res.status(500).json({ message : "Erreur lors de l'inscription", error: error.message }));
  };

exports.login = (req, res, next) => {
    User.findOne({email : req.body.email})
        .then((user) => { /*user est la valeur qui est retournée par la method findOne*/
            if (!user) {
                return res.status(401).json({error : 'Utilisateur non trouvé'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error : 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId : user._id, /*_id est créé par la BDD lors du POST au user*/
                        token : jwt.sign( // Création d'un token durant 24h lors du login
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_KEY,
                            { expiresIn: '24h' }
                        ),
                    })
                })
                .catch(error => res.status(401).json({message : "Erreur de login1", error : error.message}));
        })
        .catch(error => res.status(500).json({ message : "Erreur de login2", error: error.message }));
    };