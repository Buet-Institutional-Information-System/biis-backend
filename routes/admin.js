const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.body.designation){
            cb(null, './images/adviser/');
        }
        cb(null,'./images/student/');
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
    '/student',
    upload.single('studentImage'),
    adminController.postStudent
);
router.patch(
    '/updateGrade',
    adminController.patchUpdateGrade
);
router.delete(
    '/student',
    adminController.deleteStudent
)
router.post(
    '/teacher',
    upload.single('adviserImage'),
    adminController.postTeacher


);
router.patch(
    '/updateDesignation',
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