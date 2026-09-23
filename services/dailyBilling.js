const {
    getActiveSubscriptions,
    updateBillingResult
} = require("./firebaseSubscription");

const {
    chargeUser
} = require("./billingApi");


/*
 * ==========================================
 * DAILY BILLING
 * ==========================================
 */

async function processDailyBilling() {

    console.log("================================");
    console.log("DAILY BILLING STARTED");
    console.log("================================");


    const subscribers =
        await getActiveSubscriptions();


    console.log(
        "Active subscribers:",
        subscribers.length
    );


    for (const subscriber of subscribers) {

        const msisdn =
            subscriber.msisdn;

        const amount =
            subscriber.nextBillingAmount ||
            subscriber.billingAmount ||
            150;


        console.log("================================");
        console.log("BILLING CUSTOMER");
        console.log("MSISDN:", msisdn);
        console.log("Amount:", amount);
        console.log("================================");


        try {

            const result =
                await chargeUser({

                    msisdn,

                    amount

                });


            console.log(
                "BILLING RESPONSE:",
                result
            );


            const resultCode =
                String(
                    result?.resultCode || ""
                );


            /*
             * ==========================================
             * SUCCESS
             * ==========================================
             */

            if (resultCode === "0") {

                await updateBillingResult(

                    msisdn,

                    {

                        billingStatus:
                            "SUCCESS",

                        resultCode:
                            result.resultCode,

                        resultDesc:
                            result.resultDesc,

                        partnerTransId:
                            result.partnerTransId,

                        dotTransId:
                            result.dotTransId,

                        nextBillingAmount:
                            150

                    }

                );

                continue;

            }


            /*
             * ==========================================
             * INSUFFICIENT BALANCE
             * ==========================================
             */

            if (resultCode === "1004") {

                let nextAmount = 100;

                if (
                    Number(
                        subscriber.billingAmount
                    ) === 100
                ) {

                    nextAmount = 50;

                }


                await updateBillingResult(

                    msisdn,

                    {

                        billingStatus:
                            "INSUFFICIENT_BALANCE",

                        resultCode:
                            result.resultCode,

                        resultDesc:
                            result.resultDesc,

                        partnerTransId:
                            result.partnerTransId,

                        dotTransId:
                            result.dotTransId,

                        nextBillingAmount:
                            nextAmount

                    }

                );

                continue;

            }


            /*
             * ==========================================
             * OTHER BILLING RESULT
             * ==========================================
             */

            await updateBillingResult(

                msisdn,

                {

                    billingStatus:
                        "FAILED",

                    resultCode:
                        result.resultCode,

                    resultDesc:
                        result.resultDesc,

                    partnerTransId:
                        result.partnerTransId,

                    dotTransId:
                        result.dotTransId,

                    nextBillingAmount:
                        amount

                }

            );

        }

        catch (error) {

            console.error(
                "BILLING ERROR:",
                msisdn,
                error.response?.data ||
                error.message
            );

        }

    }


    console.log("================================");
    console.log("DAILY BILLING FINISHED");
    console.log("================================");

}


module.exports = {
    processDailyBilling
};