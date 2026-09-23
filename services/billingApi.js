const axios = require("axios");
const crypto = require("crypto");


/*
 * ==========================================
 * GENERATE PARTNER TRANSACTION ID
 * ==========================================
 */

function generatePartnerTransId() {

    return crypto
        .randomUUID()
        .replace(/-/g, "");

}


/*
 * ==========================================
 * DIRECT BILLING API
 * ==========================================
 */

async function chargeUser({

    msisdn,

    amount

}) {

    const auth =
        Buffer.from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        ).toString("base64");


    const headers = {

        Authorization:
            `Basic ${auth}`,

        PartnerId:
            process.env.PARTNER_ID,

        "Content-Type":
            "application/json",

        Accept:
            "application/json"

    };


    const partnerTransId =
        generatePartnerTransId();


    const body = {

        partnerTransId,

        opId:
            Number(process.env.OP_ID),

        msisdn,

        amount:
            String(amount),

        serviceId:
            process.env.SERVICE_ID

    };


    console.log("================================");
    console.log("DIRECT BILLING REQUEST");
    console.log(body);
    console.log("================================");


    const response =
        await axios.post(

            process.env.BILLING_API_URL,

            body,

            {
                headers
            }

        );


    console.log("================================");
    console.log("DIRECT BILLING RESPONSE");
    console.log(response.data);
    console.log("================================");


    return {

        ...response.data,

        partnerTransId

    };

}


module.exports = {

    chargeUser

};