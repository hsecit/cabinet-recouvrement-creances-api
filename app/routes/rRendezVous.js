import express from 'express'
import dotenv from 'dotenv'
import RDV from '../models/RendezVous.js'

// conf router
dotenv.config()
const router = express.Router()

// state all rendez vous 
router.get('/', (req, res) => {
    RDV.find().
        then(docs => {
            const response = {
                count: docs.length,
                rdvs: docs.map(doc => {
                    return {
                        ...doc._doc,
                        _self :{
                            type: "GET",
                            url: process.env.API_URL + '/rdvs'
                        },
                        request: {
                            type: "GET",
                            url: process.env.API_URL + '/rdvs/' + doc._id
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
// add new rdv
router.post('/', (req, res) => {
    const rdv = new RDV({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        date_rdv: req.body.date_rdv
    });
    rdv.save()
        .then(result => {
            res.status(201).json({
                ...result._doc,
                request: {
                    type: 'GET',
                    url: process.env.API_URL + '/rdvs'
                }
            })
        })

})

// get rendez vous by id
router.get('/:rdvId', (req, res, next) => {
    const rdvId = req.params.rdvId;
    RDV.findById(rdvId).
        then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    rdv: doc,
                    request: {
                        type: 'GET',
                        url: process.env.API_URL + '/rdvs'
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
router.put("/:rdvId", (req, res, next) => {
    const id = req.params.rdvId;
   
    RDV.updateOne({ _id: id }, { date_rdv : req.body.date_rdv })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'RDV updated',
                request: {
                    type: 'GET',
                    url: process.env.API_URL + '/rdvs/' + id
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
// delete rdv
router.delete("/:rdvId", (req, res, next) => {
    const id = req.params.rdvId;
    RDV.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'RDV deleted or canceled',
                request: {
                    type: 'POST',
                    url: process.env.API_URL + '/rdvs',
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

export default router