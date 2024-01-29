const express = require('express');
const bookCtrl = require('../controllers/book');
// const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const router = express.Router();

router.post('/', bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', bookCtrl.modifyOneBook);
router.delete('/:id', bookCtrl.deleteOneBook);

module.exports = router;