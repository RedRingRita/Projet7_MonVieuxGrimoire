const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Code qui ne fonctionnait pas :
// exports.signup = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//         const user = new User({
//             email : req.body.email,
//             password : hash,
//         });        
//         user.save()
//             .then(() => res.status(201).json({message : 'Utilisateur créé'}))
//             .catch(res.status(400).json({ message : "Erreur lors de l'inscription" }));
//     })
//     .catch(res.status(500).json({ message : "Erreur lors de l'inscription" }));
// };

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
                return error => res.status(401).json({ message : 'Login ou mot de passe incorrect', error: error.message})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return error => res.status(401).json({ message : 'Login ou mot de passe incorect', error: error.message })
                    }
                    res.status(200).json({
                        userId : user._id, /*_id est créé par la BDD lors du POST au user*/
                        token : jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_KEY, /*Clef de chiffrement*/
                            { expiresIn: '24h' }
                        )
                    })
                })
        })
        .catch(error => res.status(500).json({ message : "Erreur lors du login", error: error.message }));
};