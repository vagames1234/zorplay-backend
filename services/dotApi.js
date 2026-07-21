const crypto = require("crypto");

/**
 * Generate unique Partner Transaction ID
 */
function generatePartnerTxId() {
    return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Generate Landing Page Signature
 *
 * SHA256(
 * username-partner_id-service_id-op_id-partner_txid-rurl-password
 * )
 */
function generateLandingSignature(
    username,
    partnerId,
    serviceId,
    opId,
    partnerTxId,
    rurl,
    password
) {
    const data =
        `${username}-${partnerId}-${serviceId}-${opId}-${partnerTxId}-${rurl}-${password}`;

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

/**
 * Build Landing Page URL
 */
function buildLandingUrl(partnerTxId, signature) {

    const params = new URLSearchParams({

        partner_id: process.env.PARTNER_ID,

        service_id: process.env.SERVICE_ID,

        op_id: process.env.OP_ID,

        partner_txid: partnerTxId,

        rurl: process.env.RETURN_URL,

        lang: process.env.LANG,

        signature: signature

    });

    return `${process.env.LANDING_API_URL}?${params.toString()}`;
}

module.exports = {

    generatePartnerTxId,
    generateLandingSignature,
    buildLandingUrl

};