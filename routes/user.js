const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.post(
    '/signIn',
    userController.postSignIn
);
router.get(
    '/adviserInfo',
    auth,
    userController.getAdviserInfo
);
router.get(
   '/contactInfo',
    auth,
    userController.getContactInfo
)
router.patch(
    '/editInfo',
    auth,
    userController.patchEditInfo
);
router.patch(
    '/password',
    auth,
    userController.patchPassword
);
router.get(
    '/viewGrade',
    auth,
    userController.getViewGrade
);
router.get(
    '/showGrade',
    auth,
    userController.getShowGrade
);
router.get(
    '/registration',
    auth,
    userController.getRegistration
);
router.get(
    '/registrationApproval',
    auth,
    userController.getRegistrationApproval
);
router.post(
    '/insertRegistration',
    auth,
    userController.postInsertRegistration
);
module.exports=router;