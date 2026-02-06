const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const ASSISTANT_ID = import.meta.env.VITE_OPENAI_ASSISTANT_ID as string | undefined;

export type ChatMessage = { role: "user" | "assistant"; content: string };

interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: Array<{ type: string; text: { value: string } }>;
}

let threadId: string | null = null;

async function createThread(): Promise<string> {
  if (!API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "OpenAI-Beta": "assistants=v2",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create thread: ${response.statusText}`);
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}

async function sendMessage(message: string): Promise<string> {
  if (!API_KEY || !ASSISTANT_ID) {
    throw new Error("OpenAI API key or Assistant ID is not configured");
  }

  if (!threadId) {
    threadId = await createThread();
  }

  // Add message to thread
  await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "OpenAI-Beta": "assistants=v2",
    },
    body: JSON.stringify({ role: "user", content: message }),
  });

  // Run the assistant
  const runResponse = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/runs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    }
  );

  if (!runResponse.ok) {
    throw new Error(`Failed to run assistant: ${runResponse.statusText}`);
  }

  const runData = (await runResponse.json()) as { id: string };
  const runId = runData.id;

  // Poll for completion
  let isComplete = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!isComplete && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const statusResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error(
        `Failed to check run status: ${statusResponse.statusText}`
      );
    }

    const statusData = (await statusResponse.json()) as { status: string };
    isComplete = statusData.status === "completed";
    attempts++;
  }

  if (!isComplete) {
    throw new Error("Assistant response timed out");
  }

  // Get messages
  const messagesResponse = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    }
  );

  if (!messagesResponse.ok) {
    throw new Error(`Failed to get messages: ${messagesResponse.statusText}`);
  }

  const messagesData = (await messagesResponse.json()) as {
    data: ThreadMessage[];
  };
  const messages = messagesData.data;

  // Get the latest assistant message
  const assistantMessage = messages.find((m) => m.role === "assistant");
  if (!assistantMessage) {
    throw new Error("No assistant response found");
  }

  const textContent = assistantMessage.content.find(
    (c) => c.type === "text"
  ) as { type: string; text: { value: string } } | undefined;
  if (!textContent) {
    throw new Error("No text content in assistant response");
  }

  return textContent.text.value;
}

export { sendMessage };
