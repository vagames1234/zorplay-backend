require("dotenv").config();

const express = require("express");
const cors = require("cors");

const landingRoute = require("./routes/landing");

const callbackRoute = require("./routes/callback");

const subscribeRoute = require("./routes/subscribe");

const otpRoute = require("./routes/otp");

const subscribePageRoute =
    require("./routes/subscribePage");

    const unsubscribeRoute =
    require("./routes/unsubscribe");

const billingRoute = require("./routes/billing");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/callback", callbackRoute);

// Landing Page Route
app.use("/landing", landingRoute);

app.use("/otp", otpRoute);

app.use("/billing", billingRoute);

app.use("/subscribe", subscribeRoute);

app.use("/unsubscribe", unsubscribeRoute);

app.use(
    "/subscribe-page",
    subscribePageRoute
);

app.get("/", (req, res) => {
    res.send("Zorplay DOT Backend Running");
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend Working"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
