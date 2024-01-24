const Book = require('../models/book');

exports.createBook = (req, res, next) => {
    delete req.body._id;
    const bookAdded = new Book({
        ...req.body
    })
    bookAdded.save()
        .then(() => res.status(200).json({ message : "Livre ajouté"}))
        .catch(res.status(400).json({ message : "Erreur dans l'ajout du livre"}));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(res.status(400).json({message : "Erreur dans l'affichage des livres"}));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id : req.params.id})
        .then(book => res.status(200).json(book))
        .catch(rse.status(400).jsons({message : "Erreur dans l'affichage du livre"}));
};

exports.modifyOneBook = (req, res, next) => {
    Book.updateOne({_id : req.params.id}, {...req.body, _id : req.body.id})
        .then(() => res.status(200).jsons({message : "Livre modifié"}))
        .catch(res.status(400).json({message : "Erreur lors de la modification d'un livre"}));
};

exports.deleteOneBook = (req, res, next) => {
    Book.deleteOne({_id : req.params.id})
        .then(res.status(200).json({message : "Livre supprimé"}))
        .catch(res.status(400).jsons({message : "Erreur lors de la suppression du livre"}));
};