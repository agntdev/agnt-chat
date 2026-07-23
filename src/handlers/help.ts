import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const HELP = "Here's what I can do:\n\n💬 Chat — Ask me anything, and I'll reply with context.\n📝 Examples — See sample interactions.\n🗑 Clear — Reset our conversation.\n📋 Summary — Summarize some text.\n📊 Usage — Check your session stats.\n\nJust tap a button or send me a message!";

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("help", async (ctx) => {
  await ctx.reply(HELP);
});

composer.callbackQuery("menu:help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(HELP, { reply_markup: backToMenu });
});

export default composer;
