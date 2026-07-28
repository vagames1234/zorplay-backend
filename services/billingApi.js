const axios = require("axios");
const crypto = require("crypto");

/**
 * Generate Partner Transaction ID
 */
function generatePartnerTransId() {

    return crypto.randomUUID().replace(/-/g, "");

}

/**
 * Direct Billing API
 */
async function chargeUser({

    msisdn,

    amount

}) {

    const auth = Buffer.from(
        `${process.env.USERNAME}:${process.env.PASSWORD}`
    ).toString("base64");

    const headers = {

        Authorization: `Basic ${auth}`,

        PartnerId: process.env.PARTNER_ID,

        "Content-Type": "application/json",

        Accept: "application/json"

    };

    const body = {

        partnerTransId: generatePartnerTransId(),

        opId: Number(process.env.OP_ID),

        msisdn,

        amount,

        serviceId: process.env.SERVICE_ID

    };

    console.log("================================");
    console.log("DIRECT BILLING REQUEST");
    console.log(body);
    console.log("================================");

    const response = await axios.post(

        process.env.BILLING_API_URL,

        body,

        { headers }

    );

    return response.data;

}

module.exports = {

    chargeUser

};