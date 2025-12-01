// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://a65bc44a10076d753ea318403e0cb269@o4509827685220352.ingest.us.sentry.io/4509827686400000",

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});