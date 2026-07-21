const crypto = require("crypto");

/**
 * Generate SHA256 hash
 */
function generateSHA256(text) {
    return crypto
        .createHash("sha256")
        .update(text)
        .digest("hex");
}

/**
 * Verify DOT Callback Signature
 */
function generateCallbackSignature(
    username,
    reasonCode,
    reasonDesc,
    msisdn,
    serviceId,
    opId,
    partnerTxId,
    dotTxId,
    password
) {

    const data =
        `${username}-${reasonCode}-${reasonDesc}-${msisdn}-${serviceId}-${opId}-${partnerTxId}-${dotTxId}-${password}`;

    return generateSHA256(data);
}

module.exports = {

    generateSHA256,
    generateCallbackSignature

};