const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');
const validator=require('../middleware/validator');
const { check, body,params,query } = require('express-validator/check');
router.post(
    '/signIn',
    userController.postSignIn
);
router.post(
    '/logOut',
    auth,
    userController.postLogOut
);
router.get(
    '/signIn',
    auth,
    userController.getSignIn
)
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
    validator,
    userController.patchEditInfo
);
router.patch(
    '/password',
    auth,
    validator,
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