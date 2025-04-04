const express = require("express");
const router = express.Router();
const { signupMiddleware } = require("../middleware/signupMiddleware"); 
const { verifyOTP , generateOTP } = require("../middleware/otpMiddleware");
const  verifyOtpMiddleware= require("../middleware/verifyOtpMiddleware");
const { ajouterPreferenceAuClient  } = require("../middleware/preferenceMiddleware"); 
const loginMiddleware = require('../middleware/loginMiddleware'); 
const forgotPasswordMiddleware = require('../middleware/forgotPasswordMiddleware'); 
const resetPasswordMiddleware = require('../middleware/resetPasswordMiddleware'); 
const  loginGoogleMiddleware  = require('../middleware/loginGoogleMiddleware'); 

router.post("/signup", signupMiddleware); 
router.post("/verify-otp", verifyOTP);
router.post("/verify-otpp", verifyOtpMiddleware);
router.post("/generate-otp", generateOTP);
router.post("/add-prefer",  ajouterPreferenceAuClient); 
router.post("/login",  loginMiddleware); 
router.post("/forgot-pass", forgotPasswordMiddleware); 
router.post("/reset-pass", resetPasswordMiddleware); 
router.post('/google-login', loginGoogleMiddleware );

module.exports = router;
