const express = require("express");

const router = express.Router();

const {

    chargeUser

} = require("../services/billingApi");

/**
 * Direct Billing
 */

router.post("/charge", async (req, res) => {

    try {

        const {

            msisdn,

            amount

        } = req.body;

        const response = await chargeUser({

            msisdn,

            amount

        });

        res.json(response);

    }

    catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            error: error.response?.data || error.message

        });

    }

});

module.exports = router;