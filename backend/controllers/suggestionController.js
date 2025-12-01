const Suggestion = require("../models/suggestion");
const suggestionService = require("../services/suggestionService");
const logService = require("../services/logService");

const getReportById = async (req, res) => {
  try {
    const { logId } = req.body;

    const log = await logService.getLogById(logId);

    if (!log) {
      return res.status(404).json({ msg: "Log not found." });
    }

    const existing = await suggestionService.getReportByLog(logId);
    if (existing && existing.report) {
      return res.status(400).json({
        msg: "A report already exists for this log",
        existing,
      });
    }

    const report = await suggestionService.suggestionReport(logId);
    // const suggestion = new Suggestion({ report, logId });
    // await suggestion.save();

    res.status(200).json({
      message: "Suggestion created successfully",
      logId,
      report,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error general report", error: err.message });
  }
};

const getReportByLog = async (req, res, next) => {
  try {
    const { logId } = req.params;

    const result = await suggestionService.getReportByLog(logId);

    console.log(logId);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReportById, getReportByLog };
