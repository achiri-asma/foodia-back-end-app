const express = require("express");
const router = express.Router();
const { signupMiddleware } = require("../middleware/signupMiddleware"); 
const { verifyOTP , generateOTP} = require("../middleware/otpMiddleware");
const { ajouterPreferenceAuClient  } = require("../middleware/preferenceMiddleware"); 

router.post("/signup", signupMiddleware); 
router.post("/verify-otp", verifyOTP);
router.post("/generate-otp", generateOTP);
router.post("/add-prefer",  ajouterPreferenceAuClient); 

module.exports = router;
