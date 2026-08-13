const express = require("express");

const router = express.Router();

const {
    sendOtp
} = require("../services/otpApi");

const {
    subscribeUser
} = require("../services/subscriptionApi");


/*
 * OTP UI
 */

router.get("/", (req, res) => {

    res.send(`

<!DOCTYPE html>

<html>

<head>

    <title>Zorplay OTP Verification</title>

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <style>

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

        }

        input {

            width: 100%;

            padding: 12px;

            margin-top: 10px;

            margin-bottom: 15px;

            box-sizing: border-box;

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

        }

        #pinSection {

            display: none;

        }

        #message {

            margin-top: 15px;

            text-align: center;

        }

    </style>

</head>


<body>


<div class="container">

    <h2>Verify Your Mobile Number</h2>


    <p>
        Enter your Moov Gabon mobile number.
    </p>


    <input

        id="msisdn"

        type="text"

        placeholder="Example: 241XXXXXXXX"

    />


    <button

        id="sendButton"

        onclick="sendPin()"

    >

        Send PIN

    </button>


    <div id="pinSection">

        <p>
            A PIN has been sent to your mobile number.
        </p>


        <input

            id="pin"

            type="text"

            placeholder="Enter PIN"

        />


        <button

            onclick="subscribe()"

        >

            Confirm Subscription

        </button>

    </div>


    <div id="message"></div>

</div>


<script>


let otpId = null;

let currentMsisdn = null;


/*
 * Send PIN
 */

async function sendPin() {

    const msisdn =
        document.getElementById("msisdn").value.trim();


    if (!msisdn) {

        showMessage(
            "Please enter your mobile number."
        );

        return;

    }


    currentMsisdn = msisdn;


    document.getElementById(
        "sendButton"
    ).disabled = true;


    try {

        const response = await fetch(
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
            "OTP SEND RESPONSE:",
            data
        );


        if (
            data &&
            data.resultCode === "0" &&
            data.otpId
        ) {

            otpId = data.otpId;


            document.getElementById(
                "pinSection"
            ).style.display = "block";


            showMessage(
                "PIN sent successfully."
            );

        }

        else {

            showMessage(
                "Unable to send PIN. Please try again."
            );


            document.getElementById(
                "sendButton"
            ).disabled = false;

        }

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Something went wrong."
        );


        document.getElementById(
            "sendButton"
        ).disabled = false;

    }

}


/*
 * Subscription
 *
 * DOT instructed:
 * Send PIN → Subscription API
 *
 * No /otp/check call.
 */

async function subscribe() {

    const pin =
        document.getElementById("pin").value.trim();


    if (!pin) {

        showMessage(
            "Please enter the PIN."
        );

        return;

    }


    if (!otpId) {

        showMessage(
            "Please request the PIN first."
        );

        return;

    }


    try {

        const response = await fetch(
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


        if (data.success) {

            document.getElementById(
                "message"
            ).innerText =
                "Subscription successful.";

        }

        else {

            document.getElementById(
                "message"
            ).innerText =
                "Subscription failed.";

        }

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Subscription request failed."
        );

    }

}


function showMessage(message) {

    document.getElementById(
        "message"
    ).innerText = message;

}


</script>


</body>

</html>

    `);

});


/*
 * Send OTP
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


        const response =
            await sendOtp(msisdn);


        res.json(response);

    }

    catch (error) {

        console.error(
            error.response?.data ||
            error.message
        );


        res.status(500).json({

            success: false,

            error:
                error.response?.data ||
                error.message

        });

    }

});


module.exports = router;