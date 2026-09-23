require("dotenv").config();

const { processDailyBilling } = require("./services/dailyBilling");

async function run() {
    try {
        await processDailyBilling();

        console.log("Daily billing job completed successfully.");

        process.exit(0);
    } catch (error) {
        console.error(
            "Daily billing job failed:",
            error.response?.data ||
            error.message ||
            error
        );

        process.exit(1);
    }
}

run();