const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); //On transforme la chaine de caractère du corps de la requêt au format JSON, utilisable
    delete bookObject._id;
    delete bookObject._userId;
    const bookAdded = new Book({
        ...bookObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/${res.locals.imagePath}`
    });
    bookAdded.save()
        .then(() => res.status(201).json({message : "Livre ajouté"}))
        .catch(error => res.status(400).json({message : "Erreur lors de l'ajout du livre", error : error.message}));
};

exports.rateOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId === req.auth.userId) {
                res.status(401).json({ message : 'Unauthorized'});
            } else {
                console.log(req.body);
                book.ratings.push({userId : req.auth.userId, grade : req.body.rating})
                book.save()
                .then(() => res.status(200).json({message : 'Note ajoutée'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({message : "Erreur dans l'affichage des livres", error : error.message}));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id : req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({message : "Erreur dans l'affichage du livre", error : error.message}));
};

exports.modifyOneBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl : `${req.protocol}://${req.get('host')}/${res.locals.imagePath}`
    } : { ...req.body };
  
    delete bookObject._userId; // On supprime le champs _userId envoyé par le client pour éviter de changer son propriétaire.
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Unauthorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({message : "Erreur lors de la modification du livre", error : error.message}));
 };

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({_id : req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message : "Unauthorized"})
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id : req.params.id})
                    .then(() => res.status(200).json({message : "Livre supprimé"}))
                    .catch(error => res.status(400).json({message : "Erreur lors de la suppression du livre", error : error.message}));
                })
            }
        })
        .catch(error => res.status(400).json({message : "Erreur lors de la suppression du livre", error : error.message}));   
};