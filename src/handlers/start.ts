import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { mainMenuKeyboard, registerMainMenuItem } from "../toolkit/index.js";

registerMainMenuItem({ label: "💬 Chat", data: "chat:start", order: 10 });
registerMainMenuItem({ label: "📝 Examples", data: "examples:show", order: 20 });
registerMainMenuItem({ label: "🗑 Clear", data: "clear:confirm", order: 30 });
registerMainMenuItem({ label: "📋 Summary", data: "summary:show", order: 40 });
registerMainMenuItem({ label: "📊 Usage", data: "usage:show", order: 50 });

const composer = new Composer<Ctx>();

const WELCOME = "Hey there! 👋 I'm your chat assistant.\n\nSend me a message to start chatting, or pick a button below.";

composer.command("start", async (ctx) => {
  await ctx.reply(WELCOME, { reply_markup: mainMenuKeyboard() });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: mainMenuKeyboard() });
});

export default composer;
