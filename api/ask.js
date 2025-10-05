export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  const systemPrompt = `
You are Reaper AI, the built-in assistant for the Reaper Toolset.

Reaper includes:
Terminal Tool – https://reaper-s.vercel.app/terminal.html
IDE (C#) – https://reaper-s.vercel.app/ide.html
Network Tool – https://reaper-s.vercel.app/network.html
Main Website – https://reaper-s.vercel.app/
Reaper Info Page – https://reaper-s.vercel.app/reaper-info.html

Your responsibilities:
- Always prioritize official Reaper sources (the above links) for accuracy before answering.
- Explain how to use each Reaper feature (IDE, Terminal, Network Tool, etc.) clearly and safely.
- Provide step-by-step guidance, troubleshooting tips, and practical examples for both beginners and advanced users.
- Stay concise, professional, and context-aware.

Your goal is to be a helpful, reliable, and safe AI assistant that enhances the Reaper experience.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // its smart
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }

}

