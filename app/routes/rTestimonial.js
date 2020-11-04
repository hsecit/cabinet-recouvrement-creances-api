import express from 'express'
import multer from 'multer'
import Testimonial from '../models/Testimional.js'
const router = express.Router();
// configure the storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/testimonials/')
      },
      filename: function (req, file, cb) {
          console.log(file);
        cb(null,file.fieldname + '-'+ new Date().toISOString()+'.' + file.originalname.split(".")[1] )
      }
})
const uploadTestimonialImage = multer({storage : storage })

// get all testimonials from the db

router.get('/', (req, res) => {
   Testimonial.find((err, data) => {
    if (err) { res.status(500).send("erro in data"); }
    else {
        res.status(200).send(data)
    }
})
    
})


// add a new testimenal to the db
router.post('/', uploadTestimonialImage.single('authorImage') , (req, res) => {
    const testimonial = new Testimonial({
        author : req.body.author,
        statement : req.body.statement,
        photo_url : req.file.path

    });

    testimonial.
    save().then(result => {
        res.status(201).json({
            message: "Created Testimenial successfully",
            createdTestimonial : {
                _id : result._id,
                author : result.author,
                statement : result.statement,
                photo_url : 'http://localhost:8080/'+result.photo_url
            }
        })
    })
    

})



export default router;