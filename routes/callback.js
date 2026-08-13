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

        const {

            reason_code,
            reason_desc,
            msisdn,
            lpTransId,
            service_id,
            op_id,
            partner_txid,
            dot_txid,
            signature

        } = req.query;


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
        console.log("signature    :", signature);


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


        const signatureValid =
            expectedSignature === signature;


        console.log("--------------------------------");
        console.log("Signature Valid :", signatureValid);


        /*
         * Header Enrichment SUCCESS
         */

        if (
            reason_code === "0" &&
            msisdn &&
            lpTransId
        ) {

            console.log("Header Enrichment Successful");

            console.log(
                "Calling Subscription Notification API..."
            );


            const subscriptionResponse =
                await subscribeUser({

                    msisdn,

                    lpTransId,

                    partnerServiceLink:
                        process.env.PARTNER_SERVICE_LINK

                });


            return res.send(`

                <html>

                    <head>

                        <title>Subscription Result</title>

                    </head>

                    <body>

                        <h2>Subscription Successful</h2>

                        <p>You have been successfully subscribed.</p>

                    </body>

                </html>

            `);

        }


        /*
 * Header Enrichment FAILED
 *
 * Redirect user to OTP UI
 */

if (reason_code !== "0") {

    console.log("Header Enrichment Failed");

    console.log(
        "Reason Code :",
        reason_code
    );

    console.log(
        "Reason Desc :",
        reason_desc
    );

    console.log(
        "Redirecting user to OTP Flow"
    );


    const params =
        new URLSearchParams({

            reason_code:
                reason_code || "",

            reason_desc:
                reason_desc || "",

            msisdn:
                msisdn || "",

            partner_txid:
                partner_txid || "",

            dot_txid:
                dot_txid || ""

        });


    return res.redirect(
        `/otp?${params.toString()}`
    );

}

        /*
         * Unknown callback
         */

        return res.status(400).send(`

            <html>

                <head>

                    <title>Subscription Error</title>

                </head>

                <body>

                    <h2>Subscription could not be completed</h2>

                    <p>
                        Reason:
                        ${reason_desc || "Unknown error"}
                    </p>

                </body>

            </html>

        `);

    }

    catch (error) {

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