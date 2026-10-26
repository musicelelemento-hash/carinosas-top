export function buildWhatsAppUrl(phone: string | null | undefined, message?: string): string | null {
  const digits = phone?.replace(/\D/g, "") || "";
  if (digits.length < 8 || digits.length > 15) return null;
  const suffix = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${suffix}`;
}

export function buildConciergeWhatsAppUrl(message?: string): string | null {
  return buildWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_CONCIERGE, message);
}
