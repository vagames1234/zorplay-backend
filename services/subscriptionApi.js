const axios = require("axios");

/**
 * Subscription Notification API
 */
async function subscribeUser(data) {

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

        msisdn: data.msisdn,

        serviceId: process.env.SERVICE_ID,

        opId: Number(process.env.OP_ID),

        action: 1

    };

    /*
     * Header Enrichment Flow
     */
    if (data.lpTransId) {

        body.lpTransId = data.lpTransId;

        body.partnerServiceLink = data.partnerServiceLink;

    }

    /*
     * OTP Flow
     */
    if (data.otpId && data.otpPIN) {

        body.otpId = data.otpId;

        body.otpPIN = data.otpPIN;

    }

    console.log("====================================");
    console.log("Subscription Notification Request");
    console.log(body);
    console.log("====================================");

    const response = await axios.post(

        process.env.SUBSCRIPTION_API_URL,

        body,

        { headers }

    );

    return response.data;

}

module.exports = {

    subscribeUser

};