const oracledb = require('oracledb');
const database = require('../database/dbPool').database;
const jwt = require('jsonwebtoken');
const { check, body,params,query,validationResult} = require('express-validator');
const path = require('path');
const fs=require('fs');

module.exports =[
        check('name')
            .trim()
            .isLength({min:4})
            .withMessage('Please insert valid name'),
        check('dept')
            .trim()
            .isLength({min:2})
            .withMessage('Please insert valid dept'),
        check('designation')
            .trim()
            .isLength({min:4})
            .withMessage('Please insert valid designation'),
        check('password','Password should not be empty, minimum eight characters, at least one letter, one number')
            .trim()
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/i),
        check('newpassword','Password should not be empty, minimum eight characters, at least one letter, one number')
        .trim()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/i),
        check('term_id','Please insert a valid term')
            .trim()
            .isLength({min:3}),
        check('course_id','Enter valid course id')
            .trim()
            .isLength({min:3}),
        check('grade','Enter valid grade')
            .isFloat({min:0,max:4}),
        check('email','Enter valid email')
            .isEmail()
            .normalizeEmail(),
        async(req,res,next)=> {
            let errors = validationResult(req);
            errors=errors["errors"];
            for(let i=0;i<errors.length;){

                if(errors[i].value==='' || typeof(errors[i].value)==='undefined'){
                    errors.splice(i, 1);
                }
                else{
                    i++;
                }
            }
            if (errors.length!==0) {
                if(req.method=='POST'){
                    console.log("has error");
                    let filePath;
                    if(req.body.designation){
                        filePath=path.join(__dirname, '..','images','adviser',req.body.id.toString()+'.jpg');
                    }
                    filePath=path.join(__dirname, '..','images','student',req.body.id.toString()+'.jpg')
                    fs.unlink(filePath, err => console.log(err));
                }
                return res.status(400).send(errors);
            }
            else{
                console.log("no error");
                next();
            }
        }
];