import express from 'express'
import Contact from '../models/Contact.js'
import dotenv from 'dotenv'

// conf router
dotenv.config()
const router = express.Router()

// state all contact us
router.get('/', (req, res) => {
    Contact.find().
        then(docs => {
            const response = {
                count: docs.length,
                contact_us: docs.map(doc => {
                    return {
                        ...doc._doc,
                        _self :{
                            type: "GET",
                            url: process.env.API_URL + '/contacts'
                        },
                        request: {
                            type: "GET",
                            url: process.env.API_URL + '/contacts/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})
// add new contact
router.post('/', (req, res) => {
    const contact = new Contact({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        demand: req.body.demand
    });
    contact.save()
        .then(result => {
            res.status(201).json({
                ...result._doc,
                request: {
                    type: 'GET',
                    url: process.env.API_URL + '/contacts'
                }
            })
        })

})

// get contact us by id
router.get('/:contactId', (req, res, next) => {
    const contactId = req.params.contactId;
    Contact.findById(contactId).
        then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    contact_us: doc,
                    request: {
                        type: 'GET',
                        url: process.env.API_URL + '/contacts'
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
})

// update 
// TODO alter update route
router.patch("/:contactId", (req, res, next) => {
    const id = req.params.contactId;
    const updateOps = {};
    
    for (const ops of Object.keys(req.body)) {
        updateOps[ops.propName] = ops.value;
    }
    Contact.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Contact updated',
                request: {
                    type: 'GET',
                    url: process.env.API_URL + '/contacts/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
// delete contact
router.delete("/:contactId", (req, res, next) => {
    const id = req.params.contactId;
    Contact.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Contact deleted or canceled',
                request: {
                    type: 'POST',
                    url: process.env.API_URL + '/contacts',
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

export default router ; 