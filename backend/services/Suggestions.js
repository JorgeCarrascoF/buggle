require("dotenv").config();

const generateReport = async (message, description, signature) => {
  const prompt = `
    Generate an error report based on the following data:
    Error message: ${message}
    ${description ? `Error description: ${description}` : ""}
    Error signature: ${signature}

    The report should include:
    1. A brief summary of the error.
    2. Probable causes.
    3. Potential impact.
    4. Suggested steps for resolution.
    `;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.AI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );
  const data = await response.json();
  console.log("\n\n AI Response:", data.choices[0].message.content);

  return data.choices[0].message.content;
};

module.exports = { generateReport };
