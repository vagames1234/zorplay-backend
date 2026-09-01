const axios = require("axios");


/*
 * ==========================================
 * SUBSCRIPTION NOTIFICATION API
 * ==========================================
 *
 * action = 1
 * Subscribe user
 *
 */


async function subscribeUser(data) {

    /*
     * ==========================================
     * BASIC AUTHENTICATION
     * ==========================================
     */

    const auth =
        Buffer.from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        ).toString("base64");


    /*
     * ==========================================
     * REQUEST HEADERS
     * ==========================================
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
     * ==========================================
     * SUBSCRIPTION REQUEST BODY
     * ==========================================
     */

    const body = {

        msisdn:
            data.msisdn,

        serviceId:
            process.env.SERVICE_ID,

        opId:
            Number(process.env.OP_ID),

        action:
            1,

        partnerServiceLink:
            data.partnerServiceLink ||
            process.env.PARTNER_SERVICE_LINK

    };


    /*
     * ==========================================
     * HE FLOW
     * ==========================================
     *
     * If lpTransId is available,
     * send it to DOT.
     *
     */

    if (data.lpTransId) {

        body.lpTransId =
            data.lpTransId;

    }


    /*
     * ==========================================
     * OTP FLOW
     * ==========================================
     *
     * If OTP information is available,
     * send it to DOT.
     *
     */

    if (data.otpId) {

        body.otpId =
            data.otpId;

    }


    if (data.otpPIN) {

        body.otpPIN =
            data.otpPIN;

    }


    /*
     * ==========================================
     * SAFE ENVIRONMENT CHECK
     * ==========================================
     *
     * We intentionally DO NOT print:
     *
     * USERNAME
     * PASSWORD
     * AES_KEY
     * Authorization header
     *
     */

    console.log(
        "===================================="
    );

    console.log(
        "SUBSCRIPTION ENVIRONMENT CHECK"
    );

    console.log(
        "SERVICE_ID:",
        process.env.SERVICE_ID
    );

    console.log(
        "OP_ID:",
        process.env.OP_ID
    );

    console.log(
        "PARTNER_ID:",
        process.env.PARTNER_ID
    );

    console.log(
        "PARTNER_SERVICE_LINK:",
        process.env.PARTNER_SERVICE_LINK
    );

    console.log(
        "SUBSCRIPTION_API_URL:",
        process.env.SUBSCRIPTION_API_URL
    );

    console.log(
        "===================================="
    );


    /*
     * ==========================================
     * LOG SUBSCRIPTION REQUEST
     * ==========================================
     */

    console.log(
        "===================================="
    );

    console.log(
        "SUBSCRIPTION NOTIFICATION REQUEST"
    );

    console.log(
        body
    );

    console.log(
        "===================================="
    );


    /*
     * ==========================================
     * CALL DOT SUBSCRIPTION API
     * ==========================================
     */

    try {

        const response =
            await axios.post(

                process.env.SUBSCRIPTION_API_URL,

                body,

                {
                    headers
                }

            );


        /*
         * ==========================================
         * LOG SUCCESS RESPONSE
         * ==========================================
         */

        console.log(
            "===================================="
        );

        console.log(
            "SUBSCRIPTION NOTIFICATION RESPONSE"
        );

        console.log(
            "Status:",
            response.status
        );

        console.log(
            "Response:",
            response.data
        );

        console.log(
            "===================================="
        );


        /*
         * Return DOT response
         */

        return response.data;

    }

    catch (error) {

        /*
         * ==========================================
         * LOG ERROR
         * ==========================================
         */

        console.error(
            "===================================="
        );

        console.error(
            "SUBSCRIPTION NOTIFICATION ERROR"
        );

        console.error(
            "HTTP Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "Response Headers:",
            error.response?.headers
        );

        console.error(
            "URL:",
            process.env.SUBSCRIPTION_API_URL
        );

        console.error(
            "Request Body:",
            body
        );

        console.error(
            "===================================="
        );


        /*
         * Send error back to customer-care
         */

        throw error;

    }

}


/*
 * ==========================================
 * UNSUBSCRIPTION NOTIFICATION API
 * ==========================================
 *
 * action = 2
 * Unsubscribe user
 *
 */


async function unsubscribeUser(msisdn) {

    /*
     * ==========================================
     * BASIC AUTHENTICATION
     * ==========================================
     */

    const auth =
        Buffer.from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        ).toString("base64");


    /*
     * ==========================================
     * REQUEST HEADERS
     * ==========================================
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
     * ==========================================
     * UNSUBSCRIPTION REQUEST BODY
     * ==========================================
     */

    const body = {

        msisdn:
            msisdn,

        serviceId:
            process.env.SERVICE_ID,

        opId:
            Number(process.env.OP_ID),

        action:
            2

    };


    /*
     * ==========================================
     * LOG UNSUBSCRIPTION REQUEST
     * ==========================================
     */

    console.log(
        "===================================="
    );

    console.log(
        "UNSUBSCRIPTION NOTIFICATION REQUEST"
    );

    console.log(
        body
    );

    console.log(
        "===================================="
    );


    /*
     * ==========================================
     * CALL DOT UNSUBSCRIPTION API
     * ==========================================
     */

    try {

        const response =
            await axios.post(

                process.env.SUBSCRIPTION_API_URL,

                body,

                {
                    headers
                }

            );


        /*
         * ==========================================
         * LOG SUCCESS RESPONSE
         * ==========================================
         */

        console.log(
            "===================================="
        );

        console.log(
            "UNSUBSCRIPTION NOTIFICATION RESPONSE"
        );

        console.log(
            "Status:",
            response.status
        );

        console.log(
            "Response:",
            response.data
        );

        console.log(
            "===================================="
        );


        /*
         * Return DOT response
         */

        return response.data;

    }

    catch (error) {

        /*
         * ==========================================
         * LOG ERROR
         * ==========================================
         */

        console.error(
            "===================================="
        );

        console.error(
            "UNSUBSCRIPTION NOTIFICATION ERROR"
        );

        console.error(
            "HTTP Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "Response Headers:",
            error.response?.headers
        );

        console.error(
            "URL:",
            process.env.SUBSCRIPTION_API_URL
        );

        console.error(
            "Request Body:",
            body
        );

        console.error(
            "===================================="
        );


        /*
         * Send error back to customer-care
         */

        throw error;

    }

}


/*
 * ==========================================
 * EXPORT FUNCTIONS
 * ==========================================
 */

module.exports = {

    subscribeUser,
    unsubscribeUser

};