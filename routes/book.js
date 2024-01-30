const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const {upload, processImage} = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, upload, processImage, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload, processImage, bookCtrl.modifyOneBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;