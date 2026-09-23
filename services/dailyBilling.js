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

    /*
     * ==========================================
     * DRY RUN
     * ==========================================
     *
     * true  = do not send billing request
     * false = send real billing request
     */

    const DRY_RUN =
        String(process.env.BILLING_DRY_RUN).toLowerCase() === "true";


    /*
     * ==========================================
     * CHECK IF ALREADY BILLED TODAY
     * ==========================================
     */

    function isAlreadyBilledToday(lastBillingDate) {

        if (!lastBillingDate) {
            return false;
        }

        const lastDate =
            new Date(lastBillingDate)
                .toISOString()
                .slice(0, 10);

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        return lastDate === today;
    }


    console.log("================================");
    console.log("DAILY BILLING STARTED");
    console.log("================================");


    const subscribers =
        await getActiveSubscriptions();


    console.log(
        "Active subscribers:",
        subscribers.length
    );


    /*
     * ==========================================
     * PROCESS EACH ACTIVE SUBSCRIBER
     * ==========================================
     */

    for (const subscriber of subscribers) {

        const msisdn =
            subscriber.msisdn;


        /*
         * ==========================================
         * PREVENT DUPLICATE BILLING
         * ==========================================
         */

        if (
            isAlreadyBilledToday(
                subscriber.lastBillingDate
            )
        ) {

            console.log(
                "SKIPPING: Already billed today:",
                msisdn
            );

            continue;
        }


        /*
         * ==========================================
         * DETERMINE BILLING AMOUNT
         * ==========================================
         */

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

            /*
             * ==========================================
             * DRY RUN
             * ==========================================
             */

            if (DRY_RUN) {

                console.log(
                    "DRY RUN: Billing request NOT sent."
                );

                console.log(
                    "Would bill:",
                    msisdn,
                    "Amount:",
                    amount
                );

                continue;
            }


            /*
             * ==========================================
             * SEND BILLING REQUEST
             * ==========================================
             */

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

                        /*
                         * After successful billing,
                         * next attempt starts at 150.
                         */

                        nextBillingAmount:
                            150

                    }

                );

                continue;
            }


            /*
             * ==========================================
             * INSUFFICIENT BALANCE - 1004
             * ==========================================
             *
             * 150 → 100 → 50
             */

            if (resultCode === "1004") {

                let nextAmount;


                if (Number(amount) === 150) {

                    nextAmount = 100;

                } else if (Number(amount) === 100) {

                    nextAmount = 50;

                } else {

                    /*
                     * If already attempting 50,
                     * keep the next attempt at 50.
                     */

                    nextAmount = 50;
                }


                console.log(
                    "Insufficient balance.",
                    "Current amount:",
                    amount,
                    "Next amount:",
                    nextAmount
                );


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

                    /*
                     * Retry using the same amount.
                     */

                    nextBillingAmount:
                        amount

                }

            );


        } catch (error) {

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