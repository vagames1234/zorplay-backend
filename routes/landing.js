const express = require("express");

const router = express.Router();

const {

    generatePartnerTxId,
    generateLandingSignature,
    buildLandingUrl

} = require("../services/dotApi");

router.get("/", (req, res) => {

    const partnerTxId = generatePartnerTxId();

    const signature = generateLandingSignature(

        process.env.USERNAME,
        process.env.PARTNER_ID,
        process.env.SERVICE_ID,
        process.env.OP_ID,
        partnerTxId,
        process.env.RETURN_URL,
        process.env.PASSWORD

    );

    const landingUrl = buildLandingUrl(

        partnerTxId,
        signature

    );

    console.log("======================================");
    console.log("DOT Landing URL");
    console.log(landingUrl);
    console.log("======================================");

    res.redirect(landingUrl);

});

module.exports = router;