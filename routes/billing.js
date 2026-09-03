const express = require("express");

const router = express.Router();

const {
    chargeUser
} = require("../services/billingApi");


/**
 * Direct Billing
 */
router.post("/charge", async (req, res) => {

    try {

        const {
            msisdn,
            amount
        } = req.body;


        console.log("================================");
        console.log("BILLING REQUEST");
        console.log("msisdn :", msisdn);
        console.log("amount :", amount);
        console.log("================================");


        /*
         * VALIDATION
         */

        if (!msisdn) {

            return res.status(400).json({

                success: false,

                message:
                    "msisdn is required."

            });

        }


        if (
            amount === undefined ||
            amount === null
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "amount is required."

            });

        }


        /*
         * CALL BILLING API
         */

        const result =
            await chargeUser({

                msisdn,

                amount

            });


        console.log("================================");
        console.log(
            "BILLING RESPONSE"
        );
        console.log(result);
        console.log("================================");


        /*
         * DOT SUCCESS
         */

        if (
            result &&
            String(result.resultCode) === "0"
        ) {

            return res.status(201).json({

                success: true,

                response: result

            });

        }


        /*
         * DOT ERROR
         */

        return res.status(400).json({

            success: false,

            response: result

        });

    }


    catch (error) {

        console.error(
            "BILLING ERROR:",
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
