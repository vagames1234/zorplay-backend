const express = require("express");

const router = express.Router();

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
 * 0 = Customer not subscribed / MSISDN not found
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

            /*
             * Subscription processing will be
             * connected here.
             */

            return res.send("1");

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

            /*
             * Unsubscription processing will be
             * connected here.
             */

            return res.send("1");

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
            error.message
        );

        return res.send("0");

    }

});


module.exports = router;