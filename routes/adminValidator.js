const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const multer = require('multer');
const { check, body,params,query } = require('express-validator/check');
//let name='Sumaiya azad';
//console.log(name.split(' ')[0][0].toUpperCase()+name.split(' ')[0].substr(1),name.split(' ')[1].toUpperCase())
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.body.designation){
            cb(null, './images/adviser/');
        }
        if(req.body.password){
            cb(null,'./images/student/');
        }
    },
    filename: (req, file, cb) => {
        console.log("req.body: ",req.body);
        cb(null, req.body.id.toString()+'.jpg');
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter
});
router.post(
    '/student',[
        body('name')
            .trim()
            .isLength({min:4})
            .withMessage('Please insert valid name'),
        body('term','Please insert a valid term')
            .trim()
            .isLength({min:3}),
        body('password','Password should not be empty, minimum eight characters, at least one letter, one number')
            .trim()
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i)
    ],
    upload.single('studentImage'),
    adminController.postStudent
);
router.patch(
    '/updateGrade',[
        body('term_id','Enter valid term id')
            .trim()
            .isLength({min:3}),
        body('course_id','Enter valid course id')
            .trim()
            .isLength({min:3}),
        body('grade','Enter valid grade')
            .isFloat({min:0,max:4})
    ],
    adminController.patchUpdateGrade
);
router.delete(
    '/student',
    adminController.deleteStudent
)
router.post(
    '/teacher',[
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
    ],
    upload.single('adviserImage'),
    adminController.postTeacher
);
router.patch(
    '/updateDesignation',[
        body('designation')
            .trim()
            .isLength({min:4})
            .withMessage('Please insert valid designation'),
    ],
    adminController.patchUpdateDesignation
);
router.delete(
    '/teacher',
    adminController.deleteTeacher
)
router.get(
    '/engDepts',
    adminController.getEngDepts
)
router.get(
    '/depts',
    adminController.getDepts
)
router.get(
    '/terms',
    adminController.getTerms
)
module.exports=router;