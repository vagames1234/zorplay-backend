const express = require("express");

const router = express.Router();

const {
    subscribeUser
} = require("../services/subscriptionApi");

router.post("/", async (req, res) => {

    try {

        const {

            msisdn,
            lpTransId

        } = req.body;

        if (!msisdn || !lpTransId) {

            return res.status(400).json({

                success: false,

                message: "msisdn and lpTransId are required."

            });

        }

        const result = await subscribeUser(

            msisdn,
            lpTransId

        );

        res.json({

            success: true,

            response: result

        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            error: error.response?.data || error.message

        });

    }

});

module.exports = router;