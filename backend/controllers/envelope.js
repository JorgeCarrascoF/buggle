const Log = require("../models/log");
const crypto = require("crypto");

function generateHash(log) {
  const base = [
    log.culprit || "",
    log.error_type || "",
    log.environment || "",
    log.description || "",
    log.errorSignature || "",
  ].join("|");
  return crypto.createHash("sha1").update(base).digest("hex");
}

//app.post("/api/:projectId/envelope", async (req, res) => {
exports.handleSentryWebhook = async (req, res) => {
  const projectId = req.params.projectId;

  console.log("\n\n\n\n\n\n🎯 Envelope recibido del SDK Sentry:", projectId);
  console.log("Params: ", req.params);
  console.log("Headers", req.headers);
  console.log("Query:", req.query);

  console.log("Body recibido:");

  const lines = req.body.split("\n").filter(Boolean);
  const reqBody = [];

  lines.forEach((line, i) => {
    try {
      const parsedLine = JSON.parse(line);
      reqBody.push(parsedLine); // guardamos cada línea válida en el array
    } catch (err) {
      reqBody.push({
        error: `Línea ${i + 1} no es JSON válido`,
        content: line,
      });
    }
  });

  console.log("✅ Body parseado en reqBody:");
  console.dir(reqBody, { depth: null, colors: true, maxArrayLength: null });

  try {
    // NUEVA ESTRUCTURA DE UN LOG ----------------------

    const issue_id = req.query.sentry_key || "unknown_project_id"; // issue_id pasa a ser project_id, lo cogemos de la query.
    const errorSignature =
      reqBody[2].exception?.values[0].type || "UnknownError";
    const value =
      reqBody[2]?.exception?.values?.[0]?.value ??
      reqBody[2]?.message ??
      "unknown_message"; // Para evitar undefined

    const message = `${errorSignature}: ${value}`;
    const description = "";
    const culprit = reqBody[2].request.url || "unknown_culprit";
    const errorType = reqBody[2].level || "error";
    const environment = reqBody[2].environment || "production";
    const priority = "medium"; // No podemos conseguir la prioridad

    const hash = generateHash({
      culprit: culprit,
      error_type: errorType,
      environment: environment,
      errorSignature: errorSignature,
      description: "",
    });

    let log = await Log.findOne({ hash: hash });

    if (!log) {
      log = await Log.create({
        message: message,
        issue_id: issue_id,
        description: description,
        culprit: culprit,
        error_type: errorType,
        environment: environment,
        priority: priority,
        error_signature: errorSignature,
        assigned_to: "",
        status: "unresolved",
        created_at: new Date(),
        last_seen_at: new Date(),
        count: 1,
        active: true,
        userId: null,
        hash: hash,
        json_sentry: req.body,
      });
      console.log(`Log created: ${log._id}: ${log.message}`);
      console.log(
        `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
      );

      return res.status(201).json({
        msg: "Log created from Sentry webhook",
        log: log,
      });
    }

    log = await Log.findOneAndUpdate(
      { hash: hash },
      {
        $set: { last_seen_at: new Date() },
        $inc: { count: 1 },
      },
      { new: true }
    );
    console.log(`Log updated: ${log._id}: ${log.message} (${log.count})`);
    console.log(
      `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
    );
    return res.status(200).json({
      msg: "Log updated from Sentry webhook",
      log: log,
    });
  } catch (err) {
    console.error("Error processing Sentry webhook:", err);
    res
      .status(500)
      .json({ msg: "Error processing Sentry webhook", error: err.message });
  }

  res.status(200).send("OK");
}
//)
;