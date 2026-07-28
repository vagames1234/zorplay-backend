const express = require("express");

const router = express.Router();

const {

    sendOtp,

    checkOtp

} = require("../services/otpApi");

/**
 * Send OTP
 */

router.post("/send", async (req, res) => {

    try {

        const {

            msisdn

        } = req.body;

        const response =
            await sendOtp(msisdn);

        res.json(response);

    }

    catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            error:
                error.response?.data || error.message

        });

    }

});

/**
 * Check OTP
 */

router.post("/check", async (req, res) => {

    try {

        const {

            otpId,

            pin

        } = req.body;

        const response =
            await checkOtp(

                otpId,

                pin

            );

        res.json(response);

    }

    catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            error:
                error.response?.data || error.message

        });

    }

});

module.exports = router;