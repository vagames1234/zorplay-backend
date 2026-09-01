const express = require("express");

const router = express.Router();

const {
    subscribeUser,
    unsubscribeUser
} = require("../services/subscriptionApi");


/*
 * ==========================================
 * CUSTOMER CARE API
 * ==========================================
 *
 * DOT Customer Care → Our Backend
 *
 * commandType:
 * SUB   = Subscribe
 * UNSUB = Unsubscribe
 *
 * Response:
 * 1 = Successfully processed
 * 0 = Failed / Customer not found / Error
 *
 */


router.post("/", async (req, res) => {

    try {

        const {
            msgId,
            opId,
            serviceId,
            commandType,
            msisdn,
            source,
            keyWord
        } = req.body;


        console.log("====================================");
        console.log("CUSTOMER CARE REQUEST");
        console.log(req.body);
        console.log("====================================");


        /*
         * ==========================================
         * VALIDATION
         * ==========================================
         */

        if (!msisdn || !commandType) {

            console.log(
                "Customer Care: Required field missing"
            );

            return res.send("0");

        }


        /*
         * ==========================================
         * SUB REQUEST
         * ==========================================
         */

        if (commandType === "SUB") {

            console.log(
                "Customer Care SUB request"
            );


            const result =
                await subscribeUser({

                    msisdn,

                    partnerServiceLink:
                        process.env.PARTNER_SERVICE_LINK

                });


            console.log("====================================");
            console.log(
                "CUSTOMER CARE SUB RESPONSE"
            );
            console.log(result);
            console.log("====================================");


            /*
             * DOT SUCCESS
             */

            if (
                result &&
                String(result.errorCode) === "0"
            ) {

                return res.send("1");

            }


            /*
             * DOT ERROR
             */

            return res.send("0");

        }


        /*
         * ==========================================
         * UNSUB REQUEST
         * ==========================================
         */

        if (commandType === "UNSUB") {

            console.log(
                "Customer Care UNSUB request"
            );


            const result =
                await unsubscribeUser(msisdn);


            console.log("====================================");
            console.log(
                "CUSTOMER CARE UNSUB RESPONSE"
            );
            console.log(result);
            console.log("====================================");


            /*
             * DOT SUCCESS
             */

            if (
                result &&
                String(result.errorCode) === "0"
            ) {

                return res.send("1");

            }


            /*
             * DOT ERROR
             */

            return res.send("0");

        }


        /*
         * ==========================================
         * UNKNOWN COMMAND
         * ==========================================
         */

        console.log(
            "Unknown commandType:",
            commandType
        );

        return res.send("0");

    }


    catch (error) {

        console.error(
            "CUSTOMER CARE ERROR:",
            error.response?.data ||
            error.message
        );

        return res.send("0");

    }

});


module.exports = router;