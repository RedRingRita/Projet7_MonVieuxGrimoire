const express = require('express');
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/', auth, bookCtrl.createBook);
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.modifyOneBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;