import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const CLEAR_DONE = "Chat history cleared! 🗑\n\nSend me a message to start fresh.";

composer.command("clear", async (ctx) => {
  ctx.session.messages = [];
  ctx.session.rateLimit = { timestamps: [] };
  await ctx.reply(CLEAR_DONE);
});

composer.callbackQuery("clear:confirm", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.messages = [];
  ctx.session.rateLimit = { timestamps: [] };
  await ctx.editMessageText(CLEAR_DONE, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
