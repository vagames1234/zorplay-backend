const express = require("express");

const router = express.Router();

const {
    unsubscribeUser
} = require("../services/subscriptionApi");


router.post("/", async (req, res) => {

    try {

        const {
            msisdn
        } = req.body;


        console.log("================================");
        console.log("UNSUBSCRIPTION REQUEST");
        console.log("msisdn :", msisdn);
        console.log("================================");


        /*
         * Validate MSISDN
         */
        if (!msisdn) {

            return res.status(400).json({

                success: false,

                message:
                    "msisdn is required."

            });

        }


        /*
         * Call DOT Unsubscription API
         */
        const result =
            await unsubscribeUser(msisdn);


        console.log("================================");
        console.log(
            "UNSUBSCRIPTION RESULT"
        );
        console.log(result);
        console.log("================================");


        /*
         * DOT SUCCESS
         */
        if (
            result &&
            String(result.errorCode) === "0"
        ) {

            return res.json({

                success: true,

                message:
                    "MSISDN unsubscribed successfully.",

                response:
                    result

            });

        }


        /*
         * DOT ERROR
         */
        return res.status(400).json({

            success: false,

            message:
                "Unsubscription failed.",

            response:
                result

        });

    }

    catch (error) {

        console.error(
            "UNSUBSCRIPTION ERROR:",
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