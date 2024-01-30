const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Middleware pour la destination de stockage et la génération d'un om de fichier unique
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    // const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now());
  }
});

// Middleare pour optimiser l'image uploadée au format webp
async function processImage (req, res, next){
  try {
    const finalName = `${req.file.filename}.webp`;    
    await sharp(req.file.path).webp({quality : 20}).toFile("./images/" + finalName);
  }
  catch (error) {
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
}};

module.exports = {upload : multer({storage: storage}).single('image'), processImage : processImage} ;