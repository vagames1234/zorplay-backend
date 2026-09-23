const db = require("../firebaseAdmin");

function getCustomerRef(msisdn) {
    if (!msisdn) {
        throw new Error("MSISDN is required");
    }

    return db.ref(`subscriptions/${msisdn}`);
}


async function saveSubscription(data) {

    const {
        msisdn,
        serviceId,
        lpTransId,
        partnerTxId,
        dotTxId
    } = data;

    const customerRef = getCustomerRef(msisdn);

    const subscriptionData = {
        msisdn,
        serviceId: serviceId || process.env.SERVICE_ID,
        status: "ACTIVE",
        lpTransId: lpTransId || null,
        partnerTxId: partnerTxId || null,
        dotTxId: dotTxId || null,
        subscribedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await customerRef.set(subscriptionData);

    console.log(
        "Firebase subscription saved:",
        msisdn
    );

    return subscriptionData;
}


async function saveUnsubscription(msisdn) {

    const customerRef = getCustomerRef(msisdn);

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


async function getSubscription(msisdn) {

    const customerRef = getCustomerRef(msisdn);

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