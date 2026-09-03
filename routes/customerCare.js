const express = require("express");

console.log("CUSTOMER CARE ROUTE FILE LOADED");

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
 * POST /sp-notification/
 *
 * commandType:
 *
 * SUB   -> Subscribe customer
 * UNSUB -> Unsubscribe customer
 *
 * Response:
 *
 * 1 -> Successfully processed
 * 0 -> Failed / customer not found
 *
 */


router.post("/", async (req, res) => {

    try {

        /*
         * ==========================================
         * READ REQUEST
         * ==========================================
         */

        const {
            msgId,
            opId,
            serviceId,
            commandType,
            msisdn,
            source,
            keyWord
        } = req.body;


        /*
         * ==========================================
         * LOG REQUEST
         * ==========================================
         */

        console.log(
            "===================================="
        );

        console.log(
            "DOT CUSTOMER CARE REQUEST"
        );

        console.log("msgId       :", msgId);
        console.log("opId        :", opId);
        console.log("serviceId   :", serviceId);
        console.log("commandType :", commandType);
        console.log("msisdn      :", msisdn);
        console.log("source      :", source);
        console.log("keyWord     :", keyWord);

        console.log(
            "===================================="
        );


        /*
         * ==========================================
         * BASIC VALIDATION
         * ==========================================
         */

        if (
            msgId === undefined ||
            opId === undefined ||
            !serviceId ||
            !commandType ||
            !msisdn ||
            !source
        ) {

            console.log(
                "CUSTOMER CARE REQUEST INVALID"
            );

            return res.send("0");
        }


        /*
         * ==========================================
         * SUBSCRIPTION
         * ==========================================
         */

        if (commandType === "SUB") {

            console.log(
                "CUSTOMER CARE COMMAND: SUB"
            );


            const result =
                await subscribeUser({

                    msisdn: msisdn,

                    partnerServiceLink:
                        process.env.PARTNER_SERVICE_LINK

                });


            /*
             * ==========================================
             * LOG DOT RESPONSE
             * ==========================================
             */

            console.log(
                "===================================="
            );

            console.log(
                "SUBSCRIPTION API RESPONSE"
            );

            console.log(result);

            console.log(
                "===================================="
            );


            /*
             * ==========================================
             * SUCCESS
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
             * FAILURE
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

        if (commandType === "UNSUB") {

            console.log(
                "CUSTOMER CARE COMMAND: UNSUB"
            );


            const result =
                await unsubscribeUser(msisdn);


            /*
             * ==========================================
             * LOG DOT RESPONSE
             * ==========================================
             */

            console.log(
                "===================================="
            );

            console.log(
                "UNSUBSCRIPTION API RESPONSE"
            );

            console.log(result);

            console.log(
                "===================================="
            );


            /*
             * ==========================================
             * SUCCESS
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
             * FAILURE
             * ==========================================
             */

            console.log(
                "CUSTOMER CARE UNSUB FAILED"
            );

            return res.send("0");
        }


        /*
         * ==========================================
         * INVALID COMMAND TYPE
         * ==========================================
         */

        console.log(
            "INVALID COMMAND TYPE:",
            commandType
        );

        return res.send("0");

    }


    catch (error) {

        /*
         * ==========================================
         * ERROR
         * ==========================================
         */

        console.error(
            "===================================="
        );

        console.error(
            "CUSTOMER CARE ERROR"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        console.error(
            "===================================="
        );


        /*
         * DOT requires:
         *
         * 1 = success
         * 0 = failure
         */

        return res.send("0");
    }

});


module.exports = router;