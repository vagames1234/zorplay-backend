const db = require("../firebaseAdmin");


function getCustomerRef(msisdn) {

    if (!msisdn) {
        throw new Error("MSISDN is required");
    }

    return db.ref(`subscriptions/${msisdn}`);
}


/*
 * ==========================================
 * SAVE SUBSCRIPTION
 * ==========================================
 */

async function saveSubscription(data) {

    const {
        msisdn,
        serviceId,
        lpTransId,
        partnerTxId,
        dotTxId
    } = data;


    const customerRef =
        getCustomerRef(msisdn);


    const subscriptionData = {

        msisdn,

        serviceId:
            serviceId ||
            process.env.SERVICE_ID,


        // Subscription status

        status: "ACTIVE",


        // Subscription transaction details

        lpTransId:
            lpTransId || null,

        partnerTxId:
            partnerTxId || null,

        dotTxId:
            dotTxId || null,


        // Subscription dates

        subscribedAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),


        // Billing details

        billingAmount: 150,

        nextBillingAmount: 150,

        lastBillingDate: null,

        lastBillingResultCode: null,

        lastBillingResultDesc: null,

        lastPartnerTransId: null,

        lastDotTransId: null,

        billingStatus: "PENDING"

    };


    await customerRef.set(
        subscriptionData
    );


    console.log(
        "Firebase subscription saved:",
        msisdn
    );


    return subscriptionData;
}


/*
 * ==========================================
 * SAVE UNSUBSCRIPTION
 * ==========================================
 */

async function saveUnsubscription(msisdn) {

    const customerRef =
        getCustomerRef(msisdn);


    await customerRef.update({

        status: "INACTIVE",

        unsubscribedAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    });


    console.log(
        "Firebase unsubscription saved:",
        msisdn
    );

}


/*
 * ==========================================
 * GET SUBSCRIPTION
 * ==========================================
 */

async function getSubscription(msisdn) {

    const customerRef =
        getCustomerRef(msisdn);


    const snapshot =
        await customerRef.once("value");


    return snapshot.exists()
        ? snapshot.val()
        : null;

}


module.exports = {

    saveSubscription,

    saveUnsubscription,

    getSubscription

};