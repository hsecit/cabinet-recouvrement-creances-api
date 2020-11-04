import express from 'express'
import dotenv from 'dotenv'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

// import utils 
import { customPassword } from '../utils/Password.js'
import {sendMailPasswordInit} from '../utils/mailer.js'
// config 
const router = express.Router();
dotenv.config()

// get all users
router.get('/', (req, res, next) => {
    User.find().
        then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        fullname: doc.fullname,
                        email: doc.email,
                        phone: doc.phone,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: process.env.API_URL + '/users/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        })
    });
    

    // add new user
    router.post('/', (req, res, next) => {

        // generate password 
        const _password = customPassword();
        bcrypt.hash(_password, 10, function (err, hash) {
            const user = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                password: hash
            })
            user.save().
                then(result => {
                    // send mail to reset password
                    const emailSetPassword = {
                        rEmail: result.email,
                        rName:result.fullname,
                        rPassword : _password,
                        change_password_url : 'change'
                    }
                    sendMailPasswordInit(emailSetPassword)
                    res.status(201).json({
                        message: "user created",
                        userCreated: {
                            id: result._id,
                            fullname: result.fullname,
                            email: result.email,
                            phone: result.phone
                        },
                        request: {
                            type: 'GET',
                            url: process.env.API_URL + '/users'
                        }
                    })
                })
        });

    })

    // get user by id

    router.get("/:userId", (req, res, next) => {
        const id = req.params.userId;
        User.findById(id)
            .then(doc => {
                console.log("From database", doc);
                if (doc) {
                    res.status(200).json({
                        user: {
                            id: doc._id,
                            fullname: doc.fullname,
                            email: doc.email,
                            phone: doc.phone
                        },
                        request: {
                            type: 'GET',
                            url: process.env.API_URL + '/users'
                        }
                    });
                } else {
                    res
                        .status(404)
                        .json({ message: "No valid entry found for provided ID" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    });

  
    router.put("/:userId/change_password", (req, res, next) => {
        const id = req.params.userId;
        const password = req.body.password;
        User.findOne({ _id: id} , (err, user) => {
            if(!err){ 
                if(password){ 
                    bcrypt.hash(password , 10,(err,hash)=>{

                        user.password = hash ,
                        user.save((err,updatedUser) => {
                            res.status(201).send({
                                message : "password changed",
                            })
                        })
                        
                    });
                }
                
            }else{
                res.status(400).json({
                    message: `no user found with id ${id}`
                })
            }
        })
    });
    // delete user

    router.delete("/:userId", (req, res, next) => {
        const id = req.params.userId;
        User.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'User deleted',
                    request: {
                        type: 'GET',
                        url: process.env.API_URL + '/users'
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

    //   reset password 


    export default router;