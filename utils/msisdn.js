function normalizeGabonMsisdn(input) {

    if (!input) {
        throw new Error("MSISDN is required.");
    }

    let msisdn = String(input).trim();

    // Remove spaces, hyphens and parentheses
    msisdn = msisdn.replace(/[\s\-()]/g, "");

    // Remove leading +
    if (msisdn.startsWith("+")) {
        msisdn = msisdn.substring(1);
    }

    // Already international format: 241XXXXXXXX
    if (msisdn.startsWith("241")) {

        if (!/^241\d{8}$/.test(msisdn)) {
            throw new Error(
                "Invalid Gabon mobile number. Expected 241XXXXXXXX."
            );
        }

        return msisdn;
    }

    // National format: 0XXXXXXXX
    // Remove the national leading 0
    if (/^0\d{8}$/.test(msisdn)) {

        return "241" + msisdn.substring(1);
    }

    // Local number without the leading 0: XXXXXXXX
    if (/^\d{8}$/.test(msisdn)) {

        return "241" + msisdn;
    }

    throw new Error(
        "Invalid Gabon mobile number. Use 241XXXXXXXX, 0XXXXXXXX or XXXXXXXX."
    );
}

module.exports = {
    normalizeGabonMsisdn
};