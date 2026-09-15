/**
 * CARIÑOSAS.TOP — NOTIFICACIONES TELEGRAM (operación en tiempo real)
 * ==============================================================================
 * El bot avisa al dueño/operador al instante de eventos importantes (nueva
 * solicitud de verificación 4K, reserva, etc.) sin revisar el panel admin.
 *
 * Configura en Vercel:
 *   TELEGRAM_BOT_TOKEN  → de @BotFather
 *   TELEGRAM_CHAT_ID    → id del canal/grupo (vía @userinfobot o getUpdates)
 */

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // Silencioso si no está configurado

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[Telegram] send error:", err);
  }
}
