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
 * Header Enrichment Success
 */

if (
    reason_code === "0" &&
    msisdn &&
    lpTransId
) {

    console.log("Header Enrichment Successful");
    console.log("Calling Subscription Notification API...");

    const subscriptionResponse =
        await subscribeUser({

            msisdn,

            lpTransId,

            partnerServiceLink:
                process.env.PARTNER_SERVICE_LINK

        });

    return res.json({

        success: true,

        flow: "HE",

        signatureValid,

        callback: req.query,

        subscription: subscriptionResponse

    });

}

/*
 * Header Enrichment Failed
 */

if (reason_code === "1017") {

    console.log("Header Enrichment Failed");
    console.log("Redirect user to OTP Flow");

    return res.json({

        success: false,

        flow: "OTP",

        reason_code,

        reason_desc,

        callback: req.query,

        message:
            "Header Enrichment failed. Start OTP Flow."

    });

}

/*
 * Any Other Error
 */

console.log("Unhandled Callback");
console.log("Reason Code :", reason_code);
console.log("Reason Desc :", reason_desc);

return res.json({

    success: false,

    flow: "UNKNOWN",

    reason_code,

    reason_desc,

    callback: req.query

});

    }

    catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            error:
                error.response?.data || error.message

        });

    }

});

module.exports = router;