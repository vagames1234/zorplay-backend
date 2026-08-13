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


        /*
         * ==========================================
         * OTP FLOW
         * ==========================================
         *
         * DOT instructed:
         *
         * sendPin
         *     ↓
         * receive otpId
         *     ↓
         * user enters PIN
         *     ↓
         * Subscription Notification API
         *
         * No OTP check API.
         */

        if (otpId && otpPIN) {

            if (!msisdn) {

                return res.status(400).json({

                    success: false,

                    message:
                        "msisdn is required for OTP subscription."

                });

            }


            console.log("====================================");
            console.log("OTP SUBSCRIPTION REQUEST");
            console.log("msisdn :", msisdn);
            console.log("otpId  :", otpId);
            console.log("====================================");


            const result = await subscribeUser({

                msisdn,
                otpId,
                otpPIN

            });


            return res.json({

                success: true,

                flow: "OTP",

                response: result

            });

        }


        /*
         * ==========================================
         * HEADER ENRICHMENT FLOW
         * ==========================================
         */

        if (msisdn && lpTransId) {

            console.log("====================================");
            console.log("HE SUBSCRIPTION REQUEST");
            console.log("msisdn    :", msisdn);
            console.log("lpTransId :", lpTransId);
            console.log("====================================");


            const result = await subscribeUser({

                msisdn,

                lpTransId,

                partnerServiceLink:
                    partnerServiceLink ||
                    process.env.PARTNER_SERVICE_LINK

            });


            return res.json({

                success: true,

                flow: "HE",

                response: result

            });

        }


        /*
         * ==========================================
         * INVALID REQUEST
         * ==========================================
         */

        return res.status(400).json({

            success: false,

            message:
                "Invalid subscription request."

        });

    }

    catch (error) {

        console.error(
            "SUBSCRIPTION ERROR:",
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            error:
                error.response?.data ||
                error.message

        });

    }

});


module.exports = router;