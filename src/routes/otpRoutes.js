const {Router} = require('express');
const {requestOTP,verifyOTP} = require('../controllers/otpController');

const router = Router();

router.get('/request-otp',requestOTP);
router.post('/verify-otp',verifyOTP);

module.exports = router;