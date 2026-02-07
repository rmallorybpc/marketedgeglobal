import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8787;

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
    console.log("Assistant proxy body", { assistant_id, messages_length: Array.isArray(messages) ? messages.length : 0 });
    // Create a thread
    const createRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({}),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      console.error("create thread error:", text);
      return response.status(createRes.status).json({ error: text, source: "create_thread" });
    }

    const createData = await createRes.json();
    console.log("Thread created", createData);
    const threadId = createData.id;

    // Prepare input content from incoming messages. Prefer sending the
    // user text directly as the run `input` so the assistant receives a
    // single, explicit text input instead of relying on thread message
    // semantics which may trigger file-detection heuristics.
    const contentPayload = Array.isArray(messages)
      ? messages.map((m) => ({ type: "input_text", text: String(m.content) }))
      : [{ type: "input_text", text: String(messages) }];

    // Post thread messages with the content entries so the assistant
    // receives the user text as normal messages. Some Assistants API
    // deployments reject an `input` top-level param, so we prefer the
    // messages route and then start the run separately.
    const postMsgRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({ content: contentPayload }),
    });

    if (!postMsgRes.ok) {
      const text = await postMsgRes.text();
      console.error("post message error:", text);
      return response.status(postMsgRes.status).json({ error: text, source: "post_message" });
    }

    const postedMsgData = await postMsgRes.json();
    console.log("Thread message posted", postedMsgData);

    // Start a run for the assistant without using the `input` parameter
    // (some API versions reject it). The assistant will use the thread
    // messages we just posted as its input context.
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({ assistant_id }),
    });

    if (!runRes.ok) {
      const text = await runRes.text();
      console.error("start run error:", text);
      // If the Assistants API rejects an `input` parameter in some
      // deployments, fall back to the Responses API as a compatibility
      // measure so the frontend still receives a reply.
      if (String(text).includes("Unknown parameter: 'input'")) {
        try {
          const inputs = Array.isArray(messages)
            ? messages.map((m) => (typeof m === 'string' ? m : String(m.content))).join("\n")
            : String(messages);
          const payload = {
            model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
            input: inputs,
            temperature: 0.3,
          };
          const fb = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(payload),
          });
          if (!fb.ok) {
            const fbText = await fb.text();
            console.error('responses fallback error:', fbText);
            return response.status(fb.status).json({ error: fbText, source: 'responses_fallback' });
          }
          const fbData = await fb.json();
          const outputText = fbData.output_text ?? (fbData.output || [])
            .flatMap((item) => item.content || [])
            .filter((c) => c.type === 'output_text')
            .map((c) => c.text)
            .join('\n');
          return response.json({ reply: outputText || 'Sorry, no reply', fallback: 'responses_api' });
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'fallback error';
          console.error('responses fallback exception:', msg);
          return response.status(500).json({ error: msg, source: 'responses_fallback_exception' });
        }
      }
      return response.status(runRes.status).json({ error: text, source: "start_run" });
    }

    const runData = await runRes.json();
    console.log("Run started", runData);
    const runId = runData.id;

    // Poll for completion
    let isComplete = false;
    let attempts = 0;
    const maxAttempts = 30;
    while (!isComplete && attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1000));
      const statusRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "OpenAI-Beta": "assistants=v2" },
      });

      if (!statusRes.ok) {
        const text = await statusRes.text();
        console.error("run status poll error:", text);
        return response.status(statusRes.status).json({ error: text, source: "run_status" });
      }

      const statusData = await statusRes.json();
      console.log("Run status poll", { attempt: attempts + 1, status: statusData.status });
      isComplete = statusData.status === "completed";
      attempts++;
    }

    if (!isComplete) {
      return response.status(504).json({ error: "Assistant run timed out" });
    }

    // Fetch messages
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "OpenAI-Beta": "assistants=v2" },
    });

    if (!messagesRes.ok) {
      const text = await messagesRes.text();
      console.error("fetch messages error:", text);
      return response.status(messagesRes.status).json({ error: text, source: "fetch_messages" });
    }

    const messagesData = await messagesRes.json();
    console.log("Assistant messages fetched", { count: (messagesData.data || []).length, messagesData });
    const assistantMessage = (messagesData.data || []).reverse().find((m) => m.role === "assistant");

    if (!assistantMessage) {
      return response.status(500).json({ error: "No assistant response found" });
    }

    const textContent = (assistantMessage.content || []).find((c) => c.type === "text");
    const reply = textContent?.text?.value ?? "";

    // Return the assistant reply plus the raw run and messages for debugging.
    return response.json({ reply, run: runData, messages: messagesData });
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

app.listen(port, () => {
  console.log(`Agent proxy listening on http://localhost:${port}`);
});
