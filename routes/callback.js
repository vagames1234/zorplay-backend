const express = require("express");

const router = express.Router();

const {
    generateCallbackSignature
} = require("../utils/encryption");

const {
    subscribeUser
} = require("../services/subscriptionApi");


router.get("/", async (req, res) => {

    try {

        /*
         * ==========================================
         * READ DOT CALLBACK PARAMETERS
         * ==========================================
         *
         * IMPORTANT:
         * Moov sends the callback signature
         * parameter as "sginature" (not "signature").
         */

        const {
            reason_code,
            reason_desc,
            msisdn,
            lpTransId,
            service_id,
            op_id,
            partner_txid,
            dot_txid,
            sginature
        } = req.query;


        /*
         * ==========================================
         * LOG DOT CALLBACK
         * ==========================================
         */

        console.log("================================");
        console.log("DOT CALLBACK");
        console.log("reason_code  :", reason_code);
        console.log("reason_desc  :", reason_desc);
        console.log("msisdn       :", msisdn);
        console.log("lpTransId    :", lpTransId);
        console.log("service_id   :", service_id);
        console.log("op_id        :", op_id);
        console.log("partner_txid :", partner_txid);
        console.log("dot_txid     :", dot_txid);
        console.log("sginature    :", sginature);


        /*
         * ==========================================
         * GENERATE EXPECTED CALLBACK SIGNATURE
         * ==========================================
         */

        const expectedSignature =
            generateCallbackSignature(

                process.env.USERNAME,

                reason_code || "",

                reason_desc || "",

                msisdn || "",

                service_id || "",

                op_id || "",

                partner_txid || "",

                dot_txid || "",

                process.env.PASSWORD

            );


        console.log("--------------------------------");

        console.log(
            "Expected Signature :",
            expectedSignature
        );

        console.log(
            "Received Signature :",
            sginature
        );


        /*
         * ==========================================
         * VALIDATE CALLBACK SIGNATURE
         * ==========================================
         */

        if (expectedSignature !== sginature) {

            console.log(
                "Invalid DOT callback signature."
            );

            return res.status(403).send(`

                <html>

                    <head>
                        <title>Invalid Request</title>
                    </head>

                    <body>

                        <h2>
                            Invalid Request
                        </h2>

                        <p>
                            The request could not be verified.
                        </p>

                    </body>

                </html>

            `);
        }


        console.log(
            "Signature Valid : true"
        );


        /*
         * ==========================================
         * HE SUCCESS
         * ==========================================
         *
         * reason_code = 0
         *
         * Flow:
         *
         * Landing Page
         *      ↓
         * DOT HE
         *      ↓
         * HE successful
         *      ↓
         * DOT callback
         *      ↓
         * Validate signature
         *      ↓
         * Subscription Notification API
         */

        if (
            reason_code === "0" &&
            msisdn &&
            lpTransId
        ) {

            console.log(
                "Header Enrichment Successful"
            );

            console.log(
                "Calling Subscription Notification API..."
            );


            /*
             * ==========================================
             * CALL SUBSCRIPTION NOTIFICATION API
             * ==========================================
             */

            const subscriptionResponse =
                await subscribeUser({

                    msisdn: msisdn,

                    lpTransId: lpTransId,

                    partnerServiceLink:
                        process.env.PARTNER_SERVICE_LINK

                });


            console.log(
                "Subscription Response:",
                subscriptionResponse
            );


            /*
             * ==========================================
             * SUBSCRIPTION SUCCESS
             * ==========================================
             */

            if (
                subscriptionResponse &&
                String(
                    subscriptionResponse.errorCode
                ) === "0"
            ) {

                return res.send(`

                    <html>

                        <head>

                            <title>
                                Subscription Result
                            </title>

                        </head>

                        <body>

                            <h2>
                                Subscription Successful
                            </h2>

                            <p>
                                You have been successfully
                                subscribed to Zorplay.
                            </p>

                        </body>

                    </html>

                `);
            }


            /*
             * ==========================================
             * SUBSCRIPTION FAILED
             * ==========================================
             */

            return res.status(400).send(`

                <html>

                    <head>

                        <title>
                            Subscription Failed
                        </title>

                    </head>

                    <body>

                        <h2>
                            Subscription Failed
                        </h2>

                        <p>
                            ${
                                subscriptionResponse?.errorDesc
                                ||
                                "Unable to complete subscription."
                            }
                        </p>

                    </body>

                </html>

            `);

        }


        /*
         * ==========================================
         * HE FAILURE
         * ==========================================
         *
         * Moov requirement:
         *
         * reason_code = 0
         *      → HE successful
         *
         * reason_code != 0
         *      → Redirect user to OTP flow
         *
         * Examples:
         *
         * 1017 → Invalid User IP
         * 1012 → MSISDN not detected
         * etc.
         *
         * Any non-zero reason_code goes to OTP.
         */

        if (reason_code !== "0") {

            console.log(
                "Header Enrichment Failed"
            );

            console.log(
                "Reason Code :",
                reason_code
            );

            console.log(
                "Reason Desc :",
                reason_desc
            );

            console.log(
                "Redirecting user to OTP Flow."
            );


            return res.redirect(
                "/otp"
            );

        }


        /*
         * ==========================================
         * UNEXPECTED CONDITION
         * ==========================================
         */

        return res.status(400).send(`

            <html>

                <head>

                    <title>
                        Subscription Error
                    </title>

                </head>

                <body>

                    <h2>
                        Subscription Could Not Be Completed
                    </h2>

                    <p>
                        ${
                            reason_desc ||
                            "Unknown error"
                        }
                    </p>

                </body>

            </html>

        `);

    }


    catch (error) {

        /*
         * ==========================================
         * CALLBACK ERROR
         * ==========================================
         */

        console.error(
            "Callback Error:",
            error.response?.data ||
            error.message
        );


        return res.status(500).send(`

            <html>

                <head>

                    <title>
                        Server Error
                    </title>

                </head>

                <body>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        Please try again later.
                    </p>

                </body>

            </html>

        `);

    }

});


module.exports = router;