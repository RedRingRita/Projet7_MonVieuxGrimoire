const multer = require('multer');
const sharp = require('sharp');

// Configuration de multer pour sauvegarder l'image dans un buffer afin de ne pas enregistrer l'image originale.
const upload = multer({storage: multer.memoryStorage()})

async function processImagePost (req, res, next,){
    try {
        // On vérifie si un fichier a été téléchargé
        if (!req.file) {
            return res.status(400).send('Aucune image téléchargée.');
        }
        // On sauvegarde le chemin de l'image dans une variable locale pour le récupérer dans le controlleur ensuite
        res.locals.imagePath = await optimisationImage(req);
      }
    catch (error) {res.status(500).send('Une erreur s\'est produite lors du traitement de l\'image.')};
    next();
  };

async function processImagePut (req, res, next,) {
try {
    // On vérifie si un fichier a été téléchargé
    if (!req.file) {
        console.log("Aucune image téléchargée lors de la modification");      
    } else {
        // On sauvegarde le chemin de l'image dans une variable locale pour le récupérer dans le controlleur ensuite
        res.locals.imagePath = await optimisationImage(req);                
        }
    } 
    catch (error) {res.status(500).send('Une erreur s\'est produite lors du traitement de l\'image.')};
    next();
};  
  
async function optimisationImage(req) {  
    // On créé le nom de fichier pour la version redimensionnée et on désigne le chemin de la sauvegarde
    const cleanedOriginalName = req.file.originalname.replace(/\s+/g, '_'); // On remplace les espaces par des underscores
    const resizedImageName = cleanedOriginalName.replace(/\.(jpg|jpeg|png)$/i, Date.now() + '_resized.webp');
    const imagePath = 'images/' + resizedImageName;

    // On redimensionne l'image en format WebP avec Sharp
    await sharp(req.file.buffer)
        .resize(300) // On redimensionne l'image à une largeur de 300 pixels
        .webp({ quality: 80 }) // On converti l'image en format WebP avec une qualité de 80
        .toFile(imagePath); // On enregistre

    return imagePath;
}

module.exports.post = [upload.single('image'), processImagePost];
module.exports.put = [upload.single('image'), processImagePut];