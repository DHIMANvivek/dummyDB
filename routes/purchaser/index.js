const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get("/getUser", userController.getUser);
router.get("/getProduct", userController.getProduct);
router.get("/getCountries" , userController.getCountries);
router.get("/getStates" , userController.getStates);
router.get("/getDetailsByPostalCode" , userController.getDetailsByPostalCode);
router.get("/getDetailsByCountry" , userController.getDetailsByCountry);
router.get("/getDetailsByCity" , userController.getDetailsByCity);
router.get("/getDetailsByState" , userController.getDetailsByState);

module.exports = router;