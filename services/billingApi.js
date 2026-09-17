const axios = require("axios");
const crypto = require("crypto");
const http = require("http");
const https = require("https");

/*
 * ==========================================
 * PERSISTENT HTTP CONNECTION
 * ==========================================
 *
 * DOT requires HTTP connection reuse.
 */

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
    amount,
    partnerTransId
}) {

    /*
     * Generate Partner Transaction ID
     * if caller did not provide one.
     */

    const finalPartnerTransId =
        partnerTransId ||
        generatePartnerTransId();


    /*
     * BASIC AUTH
     */

    const auth =
        Buffer
            .from(
                `${process.env.USERNAME}:${process.env.PASSWORD}`
            )
            .toString("base64");


    /*
     * HEADERS
     */

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


    /*
     * REQUEST BODY
     */

    const body = {

        partnerTransId:
            finalPartnerTransId,

        opId:
            Number(process.env.OP_ID),

        msisdn:
            msisdn,

        amount:
            String(amount),

        serviceId:
            process.env.SERVICE_ID

    };


    console.log("================================");
    console.log("DIRECT BILLING REQUEST");
    console.log("================================");

    console.log(body);

    console.log("================================");


    /*
     * Select HTTP/HTTPS agent based
     * on the configured DOT URL.
     */

    const billingUrl =
        process.env.BILLING_API_URL;

    const agent =
        billingUrl.startsWith("https://")
            ? httpsAgent
            : httpAgent;


    /*
     * CALL DOT DIRECT BILLING API
     */

    try {

        const response =
            await axios.post(
                billingUrl,
                body,
                {
                    headers,
                    httpAgent,
                    httpsAgent,
                    timeout: 30000
                }
            );


        console.log("================================");
        console.log("DIRECT BILLING RESPONSE");
        console.log("================================");

        console.log(
            "HTTP Status :",
            response.status
        );

        console.log(
            "Response :",
            response.data
        );

        console.log("================================");


        /*
         * DOT response example:
         *
         * {
         *   resultCode: "0",
         *   resultDesc: "successfully charged",
         *   dotTransId: "..."
         * }
         */


        return {

            partnerTransId:
                finalPartnerTransId,

            ...response.data

        };

    }
    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "DIRECT BILLING ERROR"
        );

        console.error(
            "================================"
        );

        console.error(
            "Message :",
            error.message
        );

        console.error(
            "Status :",
            error.response?.status
        );

        console.error(
            "Response :",
            error.response?.data
        );

        console.error(
            "================================"
        );


        throw error;

    }

}

/*
 * ==========================================
 * REFUND API
 * ==========================================
 */

async function refundUser({
    msisdn,
    amount,
    dotBillingTransId,
    partnerTransId,
    operatorTransId,
    refundType,
    extraField1,
    extraField2,
    extraField3
}) {

    /*
     * Generate a unique Partner Transaction ID
     * if caller did not provide one.
     */
    const finalPartnerTransId =
        partnerTransId ||
        generatePartnerTransId();


    /*
     * BASIC AUTH
     */

    const auth =
        Buffer
            .from(
                `${process.env.USERNAME}:${process.env.PASSWORD}`
            )
            .toString("base64");


    /*
     * HEADERS
     */

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


    /*
     * REQUEST BODY
     */

    const body = {

        partnerTransId:
            finalPartnerTransId,

        opId:
            Number(process.env.OP_ID),

        msisdn:
            msisdn,

        amount:
            String(amount),

        serviceId:
            process.env.SERVICE_ID,

        dotBillingTransId:
            dotBillingTransId

    };


    /*
     * CONDITIONAL FIELDS
     */

    if (operatorTransId) {

        body.operatorTransId =
            operatorTransId;

    }


    /*
     * refundType is required only
     * when doing a partial refund.
     */

    if (refundType) {

        body.refundType =
            refundType;

    }


    if (extraField1) {

        body.extraField1 =
            extraField1;

    }


    if (extraField2) {

        body.extraField2 =
            extraField2;

    }


    if (extraField3) {

        body.extraField3 =
            extraField3;

    }


    console.log("================================");
    console.log("REFUND REQUEST");
    console.log("================================");

    console.log(body);

    console.log("================================");


    /*
     * DOT REFUND URL
     */

    const refundUrl =
        "https://dot-jo.biz/lb2/PartnersDirectBilling/refund/";


    /*
     * CALL DOT REFUND API
     */

    try {

        const response =
            await axios.post(

                refundUrl,

                body,

                {
                    headers,
                    httpAgent,
                    httpsAgent,
                    timeout: 30000
                }

            );


        console.log("================================");
        console.log("REFUND RESPONSE");
        console.log("================================");

        console.log(
            "HTTP Status :",
            response.status
        );

        console.log(
            "Response :",
            response.data
        );

        console.log("================================");


        return {

            partnerTransId:
                finalPartnerTransId,

            ...response.data

        };

    }

    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "REFUND ERROR"
        );

        console.error(
            "================================"
        );

        console.error(
            "Message :",
            error.message
        );

        console.error(
            "Status :",
            error.response?.status
        );

        console.error(
            "Response :",
            error.response?.data
        );

        console.error(
            "================================"
        );


        throw error;

    }

}


/*
 * ==========================================
 * EXPORT
 * ==========================================
 */

module.exports = {

    chargeUser,
    refundUser

};