const express = require("express");

const router = express.Router();

const {
    sendOtp
} = require("../services/otpApi");

const {
    subscribeUser
} = require("../services/subscriptionApi");


/*
 * ==========================================
 * OTP FLOW PAGE
 * ==========================================
 */

router.get("/", (req, res) => {

    res.send(`

<!DOCTYPE html>

<html>

<head>

    <title>Zorplay OTP Verification</title>

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <style>

        * {
            box-sizing: border-box;
        }

        body {

            font-family: Arial, sans-serif;

            background: #f5f5f5;

            display: flex;

            justify-content: center;

            align-items: center;

            min-height: 100vh;

            margin: 0;

        }

        .container {

            width: 90%;

            max-width: 400px;

            background: white;

            padding: 30px;

            border-radius: 12px;

            box-shadow:
                0 4px 20px rgba(0,0,0,0.1);

        }

        h2 {

            text-align: center;

            margin-top: 0;

        }

        p {

            color: #555;

            line-height: 1.5;

        }

        input {

            width: 100%;

            padding: 12px;

            margin-top: 10px;

            margin-bottom: 15px;

            border: 1px solid #ccc;

            border-radius: 6px;

            font-size: 16px;

        }

        button {

            width: 100%;

            padding: 12px;

            border: none;

            border-radius: 6px;

            background: #198754;

            color: white;

            font-size: 16px;

            cursor: pointer;

        }

        button:disabled {

            background: #999;

            cursor: not-allowed;

        }

        #pinSection {

            display: none;

            margin-top: 20px;

        }

        #message {

            margin-top: 15px;

            text-align: center;

        }

        .success {

            color: green;

        }

        .error {

            color: red;

        }

    </style>

</head>


<body>


<div class="container">


    <h2>
        Verify Your Mobile Number
    </h2>


    <p>
        Enter your Moov Gabon mobile number
        to continue your subscription.
    </p>


    <!-- MSISDN -->

    <input
        id="msisdn"
        type="text"
        inputmode="numeric"
        placeholder="Example: 241XXXXXXXX"
    >


    <button
        id="sendButton"
        onclick="sendPin()"
    >
        Send OTP
    </button>


    <!-- PIN -->

    <div id="pinSection">

        <p>
            A PIN has been sent to your
            mobile number by SMS.
        </p>


        <input
            id="pin"
            type="text"
            inputmode="numeric"
            placeholder="Enter PIN"
        >


        <button
            id="confirmButton"
            onclick="confirmPin()"
        >
            Confirm PIN
        </button>

    </div>


    <div id="message"></div>


</div>


<script>


let otpId = null;

let currentMsisdn = null;


/*
 * ==========================================
 * SEND PIN
 * ==========================================
 */

async function sendPin() {


    const msisdn =
        document
            .getElementById("msisdn")
            .value
            .trim();


    if (!msisdn) {

        showMessage(
            "Please enter your mobile number.",
            false
        );

        return;

    }


    currentMsisdn = msisdn;


    const sendButton =
        document.getElementById(
            "sendButton"
        );


    sendButton.disabled = true;


    showMessage(
        "Sending PIN...",
        true
    );


    try {


        const response =
            await fetch(
                "/otp/send",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        msisdn: msisdn

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "SEND PIN RESPONSE:",
            data
        );


        /*
         * Send PIN success
         *
         * resultCode = 0
         */

        if (
            data &&
            String(data.resultCode) === "0" &&
            data.otpId
        ) {


            otpId = data.otpId;


            document.getElementById(
                "pinSection"
            ).style.display = "block";


            showMessage(
                "PIN sent successfully. Please check your SMS.",
                true
            );


            return;

        }


        /*
         * Send PIN failed
         */

        let message =
            data?.resultDesc ||
            data?.message ||
            "Unable to send PIN. Please try again.";


        showMessage(
            message,
            false
        );


        sendButton.disabled = false;


    }

    catch (error) {


        console.error(
            "SEND PIN ERROR:",
            error
        );


        showMessage(
            "Unable to send PIN. Please try again.",
            false
        );


        sendButton.disabled = false;

    }

}


/*
 * ==========================================
 * CONFIRM PIN
 * ==========================================
 *
 * According to our client's required flow:
 *
 * Enter PIN
 *      ↓
 * Confirm PIN
 *      ↓
 * Subscription Notification API
 *
 * We therefore send:
 *
 * msisdn
 * otpId
 * otpPIN
 *
 * to /subscribe.
 *
 */

async function confirmPin() {


    const pin =
        document
            .getElementById("pin")
            .value
            .trim();


    if (!otpId) {

        showMessage(
            "Please request the PIN first.",
            false
        );

        return;

    }


    if (!pin) {

        showMessage(
            "Please enter the PIN.",
            false
        );

        return;

    }


    const confirmButton =
        document.getElementById(
            "confirmButton"
        );


    confirmButton.disabled = true;


    showMessage(
        "Confirming subscription...",
        true
    );


    try {


        const response =
            await fetch(
                "/subscribe",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        msisdn:
                            currentMsisdn,

                        otpId:
                            otpId,

                        otpPIN:
                            pin

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "SUBSCRIPTION RESPONSE:",
            data
        );


        /*
         * Our backend returns:
         *
         * success: true
         *
         * only when the Subscription
         * Notification API succeeds.
         */

        if (data.success) {


            showMessage(
                "Subscription successful.",
                true
            );


            return;

        }


        /*
         * Subscription failed
         */

        const errorMessage =
            data?.response?.errorDesc ||
            data?.error?.errorDesc ||
            data?.message ||
            "Subscription failed.";


        showMessage(
            errorMessage,
            false
        );


        confirmButton.disabled = false;


    }

    catch (error) {


        console.error(
            "SUBSCRIPTION ERROR:",
            error
        );


        showMessage(
            "Subscription request failed. Please try again.",
            false
        );


        confirmButton.disabled = false;

    }

}


/*
 * ==========================================
 * MESSAGE
 * ==========================================
 */

function showMessage(
    message,
    success
) {

    const messageElement =
        document.getElementById(
            "message"
        );


    messageElement.innerText =
        message;


    messageElement.className =
        success
            ? "success"
            : "error";

}


</script>


</body>

</html>

    `);

});


/*
 * ==========================================
 * SEND PIN API
 * ==========================================
 */

router.post("/send", async (req, res) => {

    try {

        const {
            msisdn
        } = req.body;


        if (!msisdn) {

            return res.status(400).json({

                success: false,

                message:
                    "msisdn is required."

            });

        }


        console.log(
            "================================"
        );

        console.log(
            "OTP SEND REQUEST"
        );

        console.log(
            "MSISDN:",
            msisdn
        );

        console.log(
            "================================"
        );


        const response =
            await sendOtp(msisdn);


        console.log(
            "OTP SEND RESPONSE:",
            response
        );


        return res.json(
            response
        );

    }

    catch (error) {

        console.error(
            "OTP SEND ERROR:",
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            error:
                error.response?.data ||
                error.message

        });

    }

});


module.exports = router;