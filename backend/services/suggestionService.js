const { app } = require("../langgraph/graph");
const { getLogById } = require("../services/logService");
const { generateReport } = require("../services/Suggestions");
const Suggestion = require("../models/suggestion");

// const suggestionReport = async (id, owner, repo, branch = 'main') => {
//     const log = await getLogById(id);

//     log.id = log.id.toString();

//     if(!log.error_signature){
//         log.error_signature = log.message.split(":")[0];
//         console.log("No error signature found", log);
//     }

//     const input = {
//         sentry_log: log,
//         owner: owner,
//         repo: repo,
//         branch: branch,
//     };

//     const result = await app.invoke(input);

//     return result.report

// }

const suggestionReport = async (logId) => {
  const log = await getLogById(logId);

  if (!log) throw new Error("Log not found");

  const message = log.message;
  const description = log.description || "";
  const signature = log.error_signature || message.split(":")[0];

  const report = await generateReport(message, description, signature);

  console.log("\n\n Generated report:", report);

  const suggestion = new Suggestion({ report, logId });

  await suggestion.save();

  return suggestion;
};

const getReportByLog = async (logId) => {
  const suggestion = await Suggestion.findOne({ logId });

  if (!suggestion) {
    return null;
  }
  return {
    id: suggestion._id,
    report: suggestion.report,
    log: suggestion.logId,
    created_at: suggestion.created_at,
  };
};

module.exports = { suggestionReport, getReportByLog };
