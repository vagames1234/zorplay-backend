const express = require("express");

const router = express.Router();

const {
    subscribeUser
} = require("../services/subscriptionApi");

router.post("/", async (req, res) => {

    try {

        const {
            msisdn,
            lpTransId,
            partnerServiceLink,
            otpId,
            otpPIN
        } = req.body;

        if (!msisdn) {

            return res.status(400).json({

                success: false,
                message: "msisdn is required."

            });

        }

        const result = await subscribeUser({

            msisdn,
            lpTransId,
            partnerServiceLink,
            otpId,
            otpPIN

        });

        res.json({

            success: true,
            response: result

        });

    } catch (error) {

        console.error(
            error.response?.data ||
            error.message
        );

        res.status(500).json({

            success: false,

            error:
                error.response?.data ||
                error.message

        });

    }

});

module.exports = router;