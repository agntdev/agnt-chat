import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const RATE_LIMIT = 60;
const RATE_WINDOW = 60 * 60 * 1000;
const CONTEXT_WINDOW = 20;

const composer = new Composer<Ctx>();

composer.on("message:text", async (ctx, next) => {
  const text = ctx.message.text.trim();
  if (!text) return next();
  if (text.startsWith("/")) return next();

  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  ctx.session.rateLimit.timestamps = ctx.session.rateLimit.timestamps.filter(
    (t) => t > windowStart,
  );
  if (ctx.session.rateLimit.timestamps.length >= RATE_LIMIT) {
    await ctx.reply("You're sending messages too fast! Please wait a moment and try again.");
    return;
  }
  ctx.session.rateLimit.timestamps.push(now);

  ctx.session.messages.push({ role: "user", content: text, timestamp: now });
  if (ctx.session.messages.length > CONTEXT_WINDOW) {
    ctx.session.messages = ctx.session.messages.slice(-CONTEXT_WINDOW);
  }

  const contextMessages = ctx.session.messages.slice(-CONTEXT_WINDOW);
  const reply = await generateReply(text, contextMessages);

  ctx.session.messages.push({ role: "assistant", content: reply, timestamp: Date.now() });
  if (ctx.session.messages.length > CONTEXT_WINDOW) {
    ctx.session.messages = ctx.session.messages.slice(-CONTEXT_WINDOW);
  }

  await ctx.reply(reply);
});

async function generateReply(
  input: string,
  context: Array<{ role: string; content: string }>,
): Promise<string> {
  const apiKey = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  if (!apiKey) {
    return fallbackReply(input);
  }
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a friendly, concise chat assistant. Keep replies short and helpful. Be warm and conversational.",
      },
      ...context.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: input },
    ];
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-3.5-turbo", messages, max_tokens: 300 }),
    });
    if (!res.ok) return fallbackReply(input);
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || fallbackReply(input);
  } catch {
    return fallbackReply(input);
  }
}

function fallbackReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hey! 👋 How can I help you today?";
  }
  if (lower.includes("how are you")) {
    return "I'm doing great, thanks for asking! What can I help you with?";
  }
  if (lower.includes("help")) {
    return "I'm here to help! Try asking me a question, requesting a summary, or just chatting.";
  }
  if (lower.includes("thank")) {
    return "You're welcome! 😊 Anything else I can help with?";
  }
  if (lower.includes("bye") || lower.includes("goodbye")) {
    return "See you later! 👋 Come back anytime.";
  }
  if (lower.includes("weather")) {
    return "I can't check live weather, but I can chat about it! What else is on your mind?";
  }
  if (lower.includes("joke")) {
    return "Why did the programmer quit? Because they didn't get arrays! 😄";
  }
  if (lower.includes("fact")) {
    return "Here's a fun fact: Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still good! 🍯";
  }
  return `I heard you say: "${input}"\n\nTry asking me something or tap /start for the menu!`;
}

export default composer;
