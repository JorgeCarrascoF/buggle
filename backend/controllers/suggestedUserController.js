const suggestedUserService = require("../services/suggestedUserService");

const getSuggestions = async (req, res) => {
  try {
    const { error_signature } = req.params;

    if (!error_signature) {
      return res.status(400).json({ msg: "Error signature is required" });
    }

    const suggestions = await suggestedUserService.getSuggestionsByErrorSignature(error_signature);

    res.status(200).json({
      success: true,
      error_signature,
      suggestions
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching suggestions",
      error: err.message
    });
  }
};

module.exports = { getSuggestions };