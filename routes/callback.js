const express = require("express");

const router = express.Router();

const {

    generateCallbackSignature

} = require("../utils/encryption");

router.get("/", (req, res) => {

    const {

        reason_code,
        reason_desc,
        msisdn,
        service_id,
        op_id,
        partner_txid,
        dot_txid,
        signature

    } = req.query;

    console.log("================================");
    console.log("DOT CALLBACK");
    console.log("reason_code   :", req.query.reason_code);
console.log("reason_desc   :", req.query.reason_desc);
console.log("msisdn        :", req.query.msisdn);
console.log("service_id    :", req.query.service_id);
console.log("op_id         :", req.query.op_id);
console.log("partner_txid  :", req.query.partner_txid);
console.log("dot_txid      :", req.query.dot_txid);
console.log("signature     :", req.query.signature);

console.log("--------------------------------");

console.log("Variable signature :", signature);
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

    const valid = expectedSignature === signature;

    console.log("--------------------------------");
    console.log("Received Signature :");
    console.log(signature);

    console.log("--------------------------------");
    console.log("Expected Signature :");
    console.log(expectedSignature);

    console.log("--------------------------------");
    console.log("Signature Valid :", valid);

    console.log("================================");

    res.json({

        success: true,

        signatureValid: valid,

        callback: req.query

    });

});

module.exports = router;