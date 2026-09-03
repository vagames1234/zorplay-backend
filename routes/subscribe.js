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
            otpId,
            otpPIN
        } = req.body;


        console.log("================================");
        console.log("SUBSCRIPTION REQUEST");
        console.log("msisdn    :", msisdn);
        console.log("lpTransId :", lpTransId);
        console.log("otpId     :", otpId);
        console.log("otpPIN    :", otpPIN ? "******" : "");
        console.log("================================");


        /*
         * ==========================================
         * HE FLOW
         * ==========================================
         *
         * Required:
         *
         * msisdn
         * lpTransId
         *
         */

        if (lpTransId) {

            if (!msisdn) {

                return res.status(400).json({

                    success: false,

                    message:
                        "msisdn is required for HE flow."

                });

            }

        }


        /*
         * ==========================================
         * OTP FLOW
         * ==========================================
         *
         * Required:
         *
         * msisdn
         * otpId
         * otpPIN
         *
         */

        if (otpId || otpPIN) {

            if (
                !msisdn ||
                !otpId ||
                !otpPIN
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "msisdn, otpId and otpPIN are required for OTP flow."

                });

            }

        }


        /*
         * ==========================================
         * AT LEAST ONE FLOW MUST BE PROVIDED
         * ==========================================
         */

        if (!lpTransId && !otpId) {

            return res.status(400).json({

                success: false,

                message:
                    "Either lpTransId or otpId is required."

            });

        }


        /*
         * ==========================================
         * PREVENT MIXING BOTH FLOWS
         * ==========================================
         *
         * We should receive either:
         *
         * HE:
         * msisdn + lpTransId
         *
         * OR
         *
         * OTP:
         * msisdn + otpId + otpPIN
         *
         */

        if (lpTransId && (otpId || otpPIN)) {

            return res.status(400).json({

                success: false,

                message:
                    "HE flow and OTP flow cannot be used together."

            });

        }


        /*
         * ==========================================
         * CALL SUBSCRIPTION NOTIFICATION API
         * ==========================================
         *
         * partnerServiceLink is required by DOT.
         *
         */

        const result =
            await subscribeUser({

                msisdn,

                lpTransId,

                otpId,

                otpPIN,

                partnerServiceLink:
                    process.env.PARTNER_SERVICE_LINK

            });


        console.log("================================");
        console.log(
            "SUBSCRIPTION NOTIFICATION RESPONSE"
        );
        console.log(result);
        console.log("================================");


        /*
         * ==========================================
         * DOT SUCCESS
         * ==========================================
         *
         * Subscription Notification API:
         *
         * errorCode = 0
         *
         */

        if (
            result &&
            String(result.errorCode) === "0"
        ) {

            return res.json({

                success: true,

                response: result

            });

        }


        /*
         * ==========================================
         * DOT SUBSCRIPTION ERROR
         * ==========================================
         */

        return res.status(400).json({

            success: false,

            response: result

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

