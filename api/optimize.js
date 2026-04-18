export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { resumeText, jobDesc } = req.body || {};

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ error: "Missing input" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

    const prompt = `
Optimize this resume based on the job description.

Resume:
${resumeText}

Job Description:
${jobDesc}

Return a clean, ATS-friendly resume.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    const output = data.choices?.[0]?.message?.content;

    res.status(200).json({ optimizedText: output });

  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
      details: err.message
    });
  }
}
