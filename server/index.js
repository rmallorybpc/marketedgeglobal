import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "", 10) || 8787;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/agent", async (request, response) => {
  const { messages } = request.body ?? {};

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: "messages must be an array" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: messages,
      temperature: 0.3,
    };

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return response.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();
    const outputText =
      data.output_text ??
      (data.output || [])
        .flatMap((item) => item.content || [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text)
        .join("\n");

    return response.json({ reply: outputText || "Sorry, I couldn’t generate a reply." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return response.status(500).json({ error: message });
  }
});

// Proxy for Assistants API (keeps OPENAI_API_KEY on server)
// Accept requests at `/assistant` or `/<base>/assistant` (useful when the
// frontend is served under a subpath like `/marketedgeglobal/`).
// Handler for assistant proxy; register both an explicit '/assistant' route
// and the prefixed regex route so requests match reliably.
async function assistantProxyHandler(request, response) {
  console.log("Assistant proxy received request", { path: request.path, origin: request.get("origin") });
  const { assistant_id, messages } = request.body ?? {};

  if (!assistant_id) {
    return response.status(400).json({ error: "assistant_id is required" });
  }

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: "messages must be an array" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    console.log("Assistant proxy body", { assistant_id, messages_length: Array.isArray(messages) ? messages.length : 0, messages });
    // Simpler compatibility path: use the Responses API directly with the
    // combined user messages to avoid Assistants-specific schema mismatches
    // that vary between deployments. This returns an immediate text reply.
    const inputs = Array.isArray(messages)
      ? messages.map((m) => (typeof m === 'string' ? m : String(m.content))).join('\n')
      : String(messages);

    const payload = {
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: inputs,
      temperature: 0.3,
    };

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('responses API error:', errorText);
      return response.status(apiResponse.status).json({ error: errorText, source: 'responses_api' });
    }

    const data = await apiResponse.json();
    const outputText =
      data.output_text ??
      (data.output || [])
        .flatMap((item) => item.content || [])
        .filter((content) => content.type === 'output_text')
        .map((content) => content.text)
        .join('\n');

    return response.json({ reply: outputText || 'Sorry, I couldn\'t generate a reply.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return response.status(500).json({ error: message });
  }
}

app.post('/assistant', assistantProxyHandler);
app.post(/^(.+\/)?assistant$/, assistantProxyHandler);

// List assistants (server-side) so the frontend can discover assistants
// without baking IDs into the client build.
app.get(/^(.+\/)?assistants$/, async (request, response) => {
  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/assistants", {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });

    if (!r.ok) {
      const text = await r.text();
      return response.status(r.status).json({ error: text });
    }

    const data = await r.json();
    const assistants = (data.data || []).map((a) => ({
      id: a.id,
      name: a.name || (a.metadata && a.metadata.title) || "Assistant",
      description: a.metadata?.description || "",
    }));

    return response.json({ assistants });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return response.status(500).json({ error: message });
  }
});

const host = process.env.HOST || '0.0.0.0';
const server = app.listen(port, host, () => {
  const addr = server.address();
  const bound = typeof addr === 'string' ? addr : `${host}:${port}`;
  console.log(`Agent proxy listening on http://${bound} (env PORT=${process.env.PORT})`);
});
