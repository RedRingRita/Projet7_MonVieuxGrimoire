const multer = require('multer');
const sharp = require('sharp');

// Configuration de multer pour sauvegarder l'image dans un buffer afin de ne pas enregistrer l'image originale.
const upload = multer({storage: multer.memoryStorage()})

async function processImage (req, res, next,) {
  try {
      // On vérifie si un fichier a été téléchargé
      if (!req.file) {
          return res.status(400).send('Aucune image téléchargée.');
      }

      // On créé le nom de fichier pour la version redimensionnée et on désigne le chemin de la sauvegarde
      const cleanedOriginalName = req.file.originalname.replace(/\s+/g, '_'); // Remplace les espaces par des underscores
      const resizedImageName = cleanedOriginalName.replace(/\.(jpg|jpeg|png)$/i, Date.now() + '_resized.webp');
      const imagePath = 'images/' + resizedImageName;

      // On redimensionne l'image en format WebP avec Sharp
      const resizedImage = await sharp(req.file.buffer)
        .resize(300) // Redimensionner l'image à une largeur de 300 pixels
        .webp({ quality: 80 }) // Convertir l'image en format WebP avec une qualité de 80
        .toFile(imagePath)

      // On sauvegarde le chemin de l'image dans une variable locale pour le récupérer dans le controlleur ensuite
      res.locals.imagePath = imagePath;

    } catch (error) {
      console.error('Erreur lors du traitement de l\'image :', error);
      res.status(500).send('Une erreur s\'est produite lors du traitement de l\'image.');
    }
    next();
};

module.exports = [upload.single('image'), processImage ];