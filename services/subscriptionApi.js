const axios = require("axios");


/*
 * ==========================================
 * SUBSCRIPTION NOTIFICATION API
 * ==========================================
 */

async function subscribeUser(data) {


    /*
     * Basic Authentication
     */

    const auth =
        Buffer.from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
        ).toString("base64");


    /*
     * Request Headers
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
     * Common fields
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
     * HE FLOW
     * ==========================================
     *
     * Landing Page API returns lpTransId.
     *
     * Client requirement:
     *
     * msisdn
     * serviceId
     * opId
     * action
     * lpTransId
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
     * Client requirement:
     *
     * msisdn
     * serviceId
     * opId
     * action
     * otpId
     * otpPIN
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
     * LOG RESPONSE
     * ==========================================
     */

    console.log(
        "===================================="
    );

    console.log(
        "SUBSCRIPTION NOTIFICATION RESPONSE"
    );

    console.log(
        response.data
    );

    console.log(
        "===================================="
    );


    return response.data;

}


module.exports = {

    subscribeUser

};