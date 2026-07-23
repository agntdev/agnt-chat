import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const EXAMPLES = "Here are some things you can try:\n\n💬 \"What's the weather like?\" — Ask a question\n📝 \"Summarize this: Long article text here...\" — Summarize text\n💬 \"Tell me a fun fact\" — Casual chat\n💬 \"How do I make pasta?\" — Get advice\n\nJust send a message and I'll do my best to help!";

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("examples", async (ctx) => {
  await ctx.reply(EXAMPLES);
});

composer.callbackQuery("examples:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(EXAMPLES, { reply_markup: backToMenu });
});

export default composer;
