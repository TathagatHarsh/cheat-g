import Groq from "groq-sdk";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const question = req.method === "POST" ? req.body?.q : req.query?.q;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",, // best free model on Groq
      messages: [
        {
          role: "user",
          content:
            "Explain this in simple, normal English without headings or formatting or give me the direct code:\n\n" +
            question,
        },
      ],
    });

    return res.status(200).json({
      answer: completion.choices[0]?.message?.content || "No response",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
