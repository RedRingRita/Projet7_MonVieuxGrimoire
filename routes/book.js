const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multerSharp = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, multerSharp, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multerSharp, bookCtrl.modifyOneBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;