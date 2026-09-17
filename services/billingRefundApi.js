const axios = require("axios");

const http = require("http");
const https = require("https");


const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10
});

const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10
});


async function refundUser(data) {

    const auth = Buffer
        .from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        )
        .toString("base64");


    const headers = {

        Authorization: `Basic ${auth}`,

        PartnerId:
            process.env.PARTNER_ID,

        "Content-Type":
            "application/json",

        Accept:
            "application/json"
    };


    const body = {

        partnerTransId:
            data.partnerTransId,

        opId:
            Number(process.env.OP_ID),

        msisdn:
            data.msisdn,

        amount:
            String(data.amount),

        serviceId:
            process.env.SERVICE_ID,

        dotBillingTransId:
            data.dotBillingTransId
    };


    if (data.operatorTransId) {

        body.operatorTransId =
            data.operatorTransId;
    }


    if (data.refundType) {

        body.refundType =
            data.refundType;
    }


    if (data.extraField1) {

        body.extraField1 =
            data.extraField1;
    }


    if (data.extraField2) {

        body.extraField2 =
            data.extraField2;
    }


    if (data.extraField3) {

        body.extraField3 =
            data.extraField3;
    }


    console.log("====================================");
    console.log("REFUND API REQUEST");
    console.log("URL:", process.env.REFUND_API_URL);
    console.log("BODY:", body);
    console.log("====================================");


    try {

        const response = await axios.post(

            process.env.REFUND_API_URL,

            body,

            {
                headers,
                httpAgent,
                httpsAgent,
                timeout: 30000
            }
        );


        console.log(
            "REFUND API RESPONSE:",
            response.status,
            response.data
        );


        return response.data;

    } catch (error) {

        console.error(
            "REFUND API ERROR:",
            error.response?.status,
            error.response?.data ||
            error.message
        );

        throw error;
    }
}


module.exports = {
    refundUser
};