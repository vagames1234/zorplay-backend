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


function getAuthHeaders() {

    const auth = Buffer
        .from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        )
        .toString("base64");

    return {
        Authorization: `Basic ${auth}`,
        PartnerId: process.env.PARTNER_ID,
        Accept: "application/json"
    };
}


/*
====================================================
CHECK BY DOT TRANSACTION ID
====================================================
*/

async function checkStatusByDotTransId(dotTransId) {

    const url =
        `${process.env.BILLING_API_URL}` +
        `check-transaction-status/get-by-dottransid/` +
        `${process.env.OP_ID}/` +
        `${process.env.SERVICE_ID}/` +
        `${dotTransId}`;

    console.log("====================================");
    console.log("CHECK STATUS BY DOT TRANS ID");
    console.log("URL:", url);
    console.log("DOT TRANS ID:", dotTransId);
    console.log("====================================");

    try {

        const response = await axios.get(
            url,
            {
                headers: getAuthHeaders(),
                httpAgent,
                httpsAgent,
                timeout: 30000
            }
        );

        console.log(
            "STATUS API RESPONSE:",
            response.status,
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "STATUS API ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        throw error;
    }
}


/*
====================================================
CHECK BY PARTNER TRANSACTION ID
====================================================
*/

async function checkStatusByPartnerTransId(
    partnerTransId
) {

    const url =
        `${process.env.BILLING_API_URL}` +
        `check-transaction-status/get-by-partnertransid/` +
        `${process.env.OP_ID}/` +
        `${process.env.SERVICE_ID}/` +
        `${partnerTransId}`;

    console.log("====================================");
    console.log("CHECK STATUS BY PARTNER TRANS ID");
    console.log("URL:", url);
    console.log(
        "PARTNER TRANS ID:",
        partnerTransId
    );
    console.log("====================================");

    try {

        const response = await axios.get(
            url,
            {
                headers: getAuthHeaders(),
                httpAgent,
                httpsAgent,
                timeout: 30000
            }
        );

        console.log(
            "STATUS API RESPONSE:",
            response.status,
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "STATUS API ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        throw error;
    }
}


module.exports = {
    checkStatusByDotTransId,
    checkStatusByPartnerTransId
};