export default async function handler(req, res) {
  try {
    const { resumeText, jobDesc } = req.body;

    const prompt = `
Rewrite this resume to match the job description.

Resume:
${resumeText}

Job Description:
${jobDesc}

Make it ATS-friendly:
- Strong summary
- Better bullet points
- Add missing keywords
- Clean structure
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}