const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multerSharp = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, multerSharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateOneBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.bestRating); //Pas encore implémentée
router.put('/:id', auth, multerSharp, bookCtrl.modifyOneBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;