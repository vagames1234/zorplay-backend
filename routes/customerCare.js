const express = require("express");

const router = express.Router();

const {
    subscribeUser,
    unsubscribeUser
} = require("../services/subscriptionApi");


/*
 * ==========================================
 * DOT CUSTOMER CARE API
 * ==========================================
 *
 * DOT Customer Care -> Our Backend
 *
 * commandType:
 *
 * SUB
 *     Subscribe customer
 *
 * UNSUB
 *     Unsubscribe customer
 *
 *
 * DOT expects:
 *
 * 1 = Action processed successfully
 * 0 = Action failed / customer not found
 *
 */


/*
 * ==========================================
 * CUSTOMER CARE ENDPOINT
 * ==========================================
 */

router.post("/", async (req, res) => {

    try {

        /*
         * ==========================================
         * READ DOT REQUEST
         * ==========================================
         */

        const {
            msgId,
            opId,
            serviceId,
            commandType,
            msisdn,
            source,
            keyword
        } = req.body;


        /*
         * ==========================================
         * LOG CUSTOMER CARE REQUEST
         * ==========================================
         */

        console.log("====================================");
        console.log("CUSTOMER CARE REQUEST");
        console.log(req.body);
        console.log("====================================");


        /*
         * ==========================================
         * VALIDATION
         * ==========================================
         */

        if (!msisdn) {

            console.log(
                "CUSTOMER CARE ERROR: MSISDN missing"
            );

            return res.send("0");
        }


        if (!commandType) {

            console.log(
                "CUSTOMER CARE ERROR: commandType missing"
            );

            return res.send("0");
        }


        /*
         * ==========================================
         * NORMALIZE COMMAND
         * ==========================================
         */

        const command =
            String(commandType)
                .trim()
                .toUpperCase();


        /*
         * ==========================================
         * SUBSCRIPTION
         * ==========================================
         */

        if (command === "SUB") {

            console.log(
                "Customer Care SUB request"
            );


            /*
             * ==========================================
             * CALL SUBSCRIPTION API
             * ==========================================
             *
             * subscriptionApi.js will create:
             *
             * msisdn
             * serviceId
             * opId
             * action = 1
             *
             */

            const result =
                await subscribeUser({
                    msisdn: msisdn
                });


            /*
             * ==========================================
             * LOG DOT RESPONSE
             * ==========================================
             */

            console.log("====================================");
            console.log(
                "CUSTOMER CARE SUB RESPONSE"
            );
            console.log(result);
            console.log("====================================");


            /*
             * ==========================================
             * CHECK DOT SUCCESS
             * ==========================================
             */

            if (
                result &&
                String(result.errorCode) === "0"
            ) {

                console.log(
                    "CUSTOMER CARE SUB SUCCESS"
                );

                return res.send("1");
            }


            /*
             * ==========================================
             * DOT RETURNED FAILURE
             * ==========================================
             */

            console.log(
                "CUSTOMER CARE SUB FAILED"
            );

            return res.send("0");
        }


        /*
         * ==========================================
         * UNSUBSCRIPTION
         * ==========================================
         */

        if (command === "UNSUB") {

            console.log(
                "Customer Care UNSUB request"
            );


            /*
             * ==========================================
             * CALL UNSUBSCRIPTION API
             * ==========================================
             *
             * subscriptionApi.js will create:
             *
             * msisdn
             * serviceId
             * opId
             * action = 2
             *
             */

            const result =
                await unsubscribeUser(msisdn);


            /*
             * ==========================================
             * LOG DOT RESPONSE
             * ==========================================
             */

            console.log("====================================");
            console.log(
                "CUSTOMER CARE UNSUB RESPONSE"
            );
            console.log(result);
            console.log("====================================");


            /*
             * ==========================================
             * CHECK DOT SUCCESS
             * ==========================================
             */

            if (
                result &&
                String(result.errorCode) === "0"
            ) {

                console.log(
                    "CUSTOMER CARE UNSUB SUCCESS"
                );

                return res.send("1");
            }


            /*
             * ==========================================
             * DOT RETURNED FAILURE
             * ==========================================
             */

            console.log(
                "CUSTOMER CARE UNSUB FAILED"
            );

            return res.send("0");
        }


        /*
         * ==========================================
         * UNKNOWN COMMAND
         * ==========================================
         */

        console.log(
            "CUSTOMER CARE ERROR: Unknown commandType:",
            commandType
        );

        return res.send("0");

    }


    /*
     * ==========================================
     * EXCEPTION HANDLING
     * ==========================================
     */

    catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "CUSTOMER CARE ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "===================================="
        );


        /*
         * DOT expects 0 when processing fails.
         */

        return res.send("0");
    }

});


/*
 * ==========================================
 * EXPORT ROUTER
 * ==========================================
 */

module.exports = router;