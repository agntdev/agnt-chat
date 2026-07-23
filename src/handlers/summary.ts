import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const SUMMARY_HELP = "Send me text to summarize, like:\n\n📋 Summarize this: [paste your text here]\n\nOr just describe what you'd like summarized!";

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("summary", async (ctx) => {
  const text = ctx.message?.text?.replace(/^\/summary\s*/i, "").trim();
  if (!text) {
    await ctx.reply(SUMMARY_HELP);
    return;
  }
  const summary = summarizeText(text);
  await ctx.reply(summary);
});

composer.callbackQuery("summary:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(SUMMARY_HELP, { reply_markup: backToMenu });
});

function summarizeText(text: string): string {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length <= 2) {
    return `Summary: ${sentences.join(". ")}.`;
  }
  const half = Math.ceil(sentences.length / 2);
  const picked = sentences.slice(0, half);
  return `Summary: ${picked.join(". ")}.`;
}

export default composer;
