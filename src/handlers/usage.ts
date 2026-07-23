import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("usage:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  const msgCount = ctx.session.messages.length;
  const rateUsed = ctx.session.rateLimit.timestamps.length;
  const memberSince = new Date(ctx.session.createdAt).toLocaleDateString();
  const text = `📊 Your session stats:\n\n💬 Messages in history: ${msgCount} / 20\n⏱ Rate limit used: ${rateUsed} / 60 per hour\n📅 Session since: ${memberSince}`;
  await ctx.editMessageText(text, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
