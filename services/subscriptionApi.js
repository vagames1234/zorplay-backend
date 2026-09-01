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
     *
     * DOT documentation specifies:
     *
     * msisdn
     * serviceId
     * opId
     * action
     *
     */

    const body = {

        msisdn:
            data.msisdn,

        serviceId:
            process.env.SERVICE_ID,

        opId:
            Number(process.env.OP_ID),

        action:
            1

    };


    /*
     * ==========================================
     * LANDING PAGE FLOW
     * ==========================================
     *
     * lpTransId is mandatory when
     * Partners Landing Page API is used.
     *
     */

    if (data.lpTransId) {

        body.lpTransId =
            data.lpTransId;

    }


    /*
     * ==========================================
     * MSISDN FORWARDING FLOW
     * ==========================================
     *
     * heId is conditional.
     *
     */

    if (data.heId) {

        body.heId =
            data.heId;

    }


    /*
     * ==========================================
     * OTP FLOW
     * ==========================================
     *
     * otpId and otpPIN are mandatory
     * when OTP API is used.
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
     * LOG REQUEST
     * ==========================================
     */

    console.log(
        "===================================="
    );

    console.log(
        "SUBSCRIPTION NOTIFICATION REQUEST"
    );

    console.log(
        "URL:",
        process.env.SUBSCRIPTION_API_URL
    );

    console.log(
        "Request Body:",
        body
    );

    console.log(
        "===================================="
    );


    /*
     * ==========================================
     * CALL DOT API
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
            "HTTP Status:",
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
     * LOG REQUEST
     * ==========================================
     */

    console.log(
        "===================================="
    );

    console.log(
        "UNSUBSCRIPTION NOTIFICATION REQUEST"
    );

    console.log(
        "URL:",
        process.env.SUBSCRIPTION_API_URL
    );

    console.log(
        "Request Body:",
        body
    );

    console.log(
        "===================================="
    );


    /*
     * ==========================================
     * CALL DOT API
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
            "HTTP Status:",
            response.status
        );

        console.log(
            "Response:",
            response.data
        );

        console.log(
            "===================================="
        );


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