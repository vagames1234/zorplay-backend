const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {

    res.send(`

<!DOCTYPE html>

<html>

<head>

    <title>Zorplay Subscription</title>

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">


    <style>

        * {
            box-sizing: border-box;
        }


        body {

            margin: 0;

            min-height: 100vh;

            font-family: Arial, sans-serif;

            background: #f5f5f5;

            display: flex;

            justify-content: center;

            align-items: center;

        }


        .container {

            width: 90%;

            max-width: 400px;

            background: white;

            padding: 30px;

            border-radius: 15px;

            box-shadow:
                0 5px 25px rgba(0, 0, 0, 0.15);

            text-align: center;

        }


        .logo {

            font-size: 32px;

            font-weight: bold;

            margin-bottom: 10px;

        }


        h2 {

            margin-bottom: 10px;

        }


        p {

            color: #555;

            line-height: 1.5;

        }


        .confirm-button {

            width: 100%;

            padding: 14px;

            margin-top: 20px;

            border: none;

            border-radius: 8px;

            background: #198754;

            color: white;

            font-size: 17px;

            cursor: pointer;

        }


        .confirm-button:hover {

            background: #157347;

        }


        .terms {

            font-size: 12px;

            color: #777;

            margin-top: 20px;

        }

    </style>

</head>


<body>


    <div class="container">


        <div class="logo">
            Zorplay
        </div>


        <h2>
            Subscribe to Zorplay
        </h2>


        <p>
            Click the button below to continue
            with your subscription.
        </p>


        <button
            class="confirm-button"
            onclick="confirmSubscription()"
        >

            Confirm

        </button>


        <div class="terms">

            By continuing, you agree to the
            service subscription.

        </div>


    </div>


<script>


function confirmSubscription() {

    window.location.href = "/landing";

}


</script>


</body>

</html>

    `);

});


module.exports = router;