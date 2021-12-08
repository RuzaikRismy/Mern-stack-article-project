const express = require('express');
const router = express.Router();
const Articles = require('../models/Articles');
const multer = require('multer');
const auth = require('../middleware/auth')


// //Initializig express
// const app = express();

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, "./client/public/uploads/");
    },
    filename :(req, file, callback) => {
        callback(null, file.originalname);
    }
})

//put storage to upload
const upload = multer({storage: storage});


//@router GET apuploadi/article
//@desc GET All article
//@access Public
router.get('/',(req,res)=>{
    Articles.find()
    .sort({date:-1})
    .then(article=> res.json(article))
    // .catch(err=> res.status(400).res.json(`Error:${err}`));
});

//@router POST api/article
//@desc POST an article
//@access Public
 router.post('/add', upload.single("articleImage") ,auth, (req,res)=>{
// router.post('/add' , (req,res)=>{
    const newArticle = new Articles({
        title:req.body.title,
        article:req.body.article,
        authorname:req.body.authorname,
        articleImage: req.file.originalname
    });
    // newArticle.save().then(article => res.json(article));
    newArticle
    .save()
    .then(() => res.json("The new Article added Successfully"))
    .catch(err=> res.status(400).res.json(`Error:${err}`));
});

//@router GET api/article
//@desc GET an article
//@access Public
//Find article by id
router.get('/:id',(req,res) => {
Articles.findById(req.params.id)
.then(article => res.json(article))
.catch(err => res.status(400).json(`Error: ${err}`));
});

//@router UPDATE api/article
//@desc UPDATE an article
//@access Public

  router.put('/update/:id', upload.single('articleImage') ,auth, (req,res) => {
// router.put('/update/:id' , (req,res) => {
    Articles.findById(req.params.id)
    .then(article => {
        article.title = req.body.title,
        article.article = req.body.article,
        article.authorname = req.body.authorname,
        article.articleImage = req.file.originalname

        article
        .save()
        .then(() => res.json("Update Successfully!"))
        .catch(err => res.status(400).json(`Error:${err}`));
    });
});

//@router DELETE api/article
//@desc DELETE an article
//@access Public

router.delete('/:id',(req,res) => {
    Articles.findById(req.params.id)
    .then(article => article
        .remove()
        .then(() => res.json("Successfully delete an article")))
        .catch(err => res.status(404).json(`Error:${err}`));
});

module.exports = router;

