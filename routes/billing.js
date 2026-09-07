const express = require("express");

const {
    chargeUser
} = require("../services/billingApi");

const {
    checkStatusByDotTransId,
    checkStatusByPartnerTransId
} = require("../services/billingStatusApi");

const {
    refundUser
} = require("../services/billingRefundApi");

const router = express.Router();

console.log("===== BILLING ROUTES LOADED =====");


/*
====================================================
1. DIRECT BILLING / CHARGE
POST /billing/charge
====================================================
*/

router.post("/charge", async (req, res) => {

    try {

        const {
            msisdn,
            amount,
            partnerTransId
        } = req.body;

        if (!msisdn || !amount) {
            return res.status(400).json({
                success: false,
                message: "msisdn and amount are required"
            });
        }

        console.log("====================================");
        console.log("CHARGE REQUEST");
        console.log("MSISDN:", msisdn);
        console.log("AMOUNT:", amount);
        console.log("PARTNER TRANS ID:", partnerTransId);
        console.log("====================================");

        const result = await chargeUser({
            msisdn,
            amount,
            partnerTransId
        });

        if (result.resultCode === "0") {

            return res.status(201).json({
                success: true,
                response: result
            });

        }

        return res.status(400).json({
            success: false,
            response: result
        });

    } catch (error) {

        console.error(
            "CHARGE ROUTE ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});


/*
====================================================
2. CHECK TRANSACTION STATUS BY DOT TRANSACTION ID
GET /billing/status/dot/:dotTransId
====================================================
*/

router.get("/status/dot/:dotTransId", async (req, res) => {

    try {

        const { dotTransId } = req.params;

        if (!dotTransId) {
            return res.status(400).json({
                success: false,
                message: "dotTransId is required"
            });
        }

        console.log("====================================");
        console.log("CHECK STATUS BY DOT TRANS ID");
        console.log("DOT TRANS ID:", dotTransId);
        console.log("====================================");

        const result =
            await checkStatusByDotTransId(dotTransId);

        return res.status(200).json({
            success: true,
            response: result
        });

    } catch (error) {

        console.error(
            "STATUS BY DOT TRANS ID ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});


/*
====================================================
3. CHECK TRANSACTION STATUS BY PARTNER TRANSACTION ID
GET /billing/status/partner/:partnerTransId
====================================================
*/

router.get("/status/partner/:partnerTransId", async (req, res) => {

    try {

        const { partnerTransId } = req.params;

        if (!partnerTransId) {
            return res.status(400).json({
                success: false,
                message: "partnerTransId is required"
            });
        }

        console.log("====================================");
        console.log("CHECK STATUS BY PARTNER TRANS ID");
        console.log("PARTNER TRANS ID:", partnerTransId);
        console.log("====================================");

        const result =
            await checkStatusByPartnerTransId(partnerTransId);

        return res.status(200).json({
            success: true,
            response: result
        });

    } catch (error) {

        console.error(
            "STATUS BY PARTNER TRANS ID ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});


/*
====================================================
4. TRANSACTION STATUS NOTIFICATION
DOT -> OUR BACKEND
POST /billing/notification
====================================================
*/

router.post("/notification", async (req, res) => {

    try {

        console.log("====================================");
        console.log("BILLING NOTIFICATION RECEIVED");
        console.log(req.body);
        console.log("====================================");

        const {
            dotTransId,
            partnerTransId,
            opId,
            msisdn,
            amount,
            serviceId,
            resultCode,
            resultDesc
        } = req.body;

        if (
            !dotTransId ||
            !partnerTransId ||
            !opId ||
            !msisdn ||
            !amount ||
            !serviceId ||
            resultCode === undefined
        ) {

            console.log(
                "INVALID BILLING NOTIFICATION"
            );

            return res.status(400).send("0");
        }

        console.log("DOT TRANS ID:", dotTransId);
        console.log("PARTNER TRANS ID:", partnerTransId);
        console.log("OP ID:", opId);
        console.log("MSISDN:", msisdn);
        console.log("AMOUNT:", amount);
        console.log("SERVICE ID:", serviceId);
        console.log("RESULT CODE:", resultCode);
        console.log("RESULT DESC:", resultDesc);

        /*
         * DOT expects HTTP 200
         * with body "1" when notification
         * is successfully received.
         */

        return res.status(200).send("1");

    } catch (error) {

        console.error(
            "BILLING NOTIFICATION ERROR:",
            error.message
        );

        return res.status(500).send("0");
    }
});


/*
====================================================
5. REFUND
POST /billing/refund
====================================================
*/

router.post("/refund", async (req, res) => {

    try {

        const {
            partnerTransId,
            msisdn,
            amount,
            dotBillingTransId,
            operatorTransId,
            refundType,
            extraField1,
            extraField2,
            extraField3
        } = req.body;

        if (
            !partnerTransId ||
            !msisdn ||
            !amount ||
            !dotBillingTransId
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "partnerTransId, msisdn, amount and dotBillingTransId are required"
            });
        }

        console.log("====================================");
        console.log("REFUND REQUEST");
        console.log("PARTNER TRANS ID:", partnerTransId);
        console.log("MSISDN:", msisdn);
        console.log("AMOUNT:", amount);
        console.log(
            "DOT BILLING TRANS ID:",
            dotBillingTransId
        );
        console.log(
            "OPERATOR TRANS ID:",
            operatorTransId
        );
        console.log("REFUND TYPE:", refundType);
        console.log("====================================");

        const result = await refundUser({
            partnerTransId,
            msisdn,
            amount,
            dotBillingTransId,
            operatorTransId,
            refundType,
            extraField1,
            extraField2,
            extraField3
        });

        if (result.resultCode === "0") {

            return res.status(200).json({
                success: true,
                response: result
            });
        }

        return res.status(400).json({
            success: false,
            response: result
        });

    } catch (error) {

        console.error(
            "REFUND ROUTE ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});


module.exports = router;