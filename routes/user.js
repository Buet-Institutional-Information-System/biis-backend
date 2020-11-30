const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get(
    '/signIn',
    userController.getSignIn
);
router.get(
    '/adviser/:id',
    userController.getAdviser
);
router.get(
   '/contactInfo/:id',
    userController.getContactInfo
)
router.patch(
    '/editInfo',
    userController.patchEditInfo
);
router.patch(
    '/password',
    userController.patchPassword
);
router.get(
    '/viewGrade/:id',
    userController.getViewGrade
);
router.get(
    '/showGrade',
    userController.getShowGrade
);
router.get(
    '/registration',
    userController.getRegistration
);
router.get(
    '/registrationApproval',
    userController.getRegistrationApproval
);
router.post(
    '/insertRegistration',
    userController.postInsertRegistration
);
module.exports=router;