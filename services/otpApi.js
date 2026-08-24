const axios = require("axios");
const crypto = require("crypto");

/**
 * Generate Partner Transaction ID
 */
function generatePartnerTransId() {

    return crypto.randomUUID().replace(/-/g, "");

}

/**
 * Send OTP
 */
async function sendOtp(msisdn) {

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

        msisdn: msisdn,

        opId: Number(process.env.OP_ID),

        serviceId: process.env.SERVICE_ID,

        partnerTransId: generatePartnerTransId(),

        amount: 150,

        otpMessage: "Your OTP is ##"

    };

    console.log("================================");
    console.log("OTP SEND REQUEST");
    console.log(body);
    console.log("================================");

    const response = await axios.post(

        process.env.OTP_SEND_URL,

        body,

        { headers }

    );

    return response.data;

}

/**
 * Check OTP
 */
async function checkOtp(otpId, pin) {

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

        otpId,

        pin

    };

    console.log("================================");
    console.log("OTP CHECK REQUEST");
    console.log(body);
    console.log("================================");

    const response = await axios.post(

        process.env.OTP_CHECK_URL,

        body,

        { headers }

    );

    return response.data;

}

module.exports = {

    sendOtp,

    checkOtp

};