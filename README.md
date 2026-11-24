# Cariñosas.top

Plataforma de anuncios y conexión para acompañantes en Ecuador. Next.js 16 (App Router) + React 19 + Tailwind CSS v4, con Supabase (Postgres + Auth + Storage), Cloudflare (edge/Turnstile) y Vercel como hosting.

## Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Three.js (hero 3D).
- **Backend**: Server Actions + API routes de Next.js, Supabase Postgres (con RLS) como base de datos.
- **Pagos**: NOWPayments (checkout cripto USDT automático para el pase VIP).
- **Verificación de identidad (OTP)**: Twilio SMS, con fallback a WhatsApp.
- **Antibot**: Cloudflare Turnstile, validado siempre en servidor (fail-closed).
- **Subida de archivos**: UploadThing (fotos/audio/video de verificación 4K).
- **Observabilidad**: Sentry.

## Requisitos

- Node.js 20+
- Una cuenta de Supabase (proyecto Postgres)
- Cuentas de Twilio, NOWPayments, Cloudflare Turnstile y UploadThing para las funciones correspondientes (ver detalle abajo)

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa los valores reales, ver sección de abajo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Todas están documentadas con comentarios en [`.env.example`](./.env.example). Resumen por criticidad:

| Variable | Obligatoria | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Sí | Base de datos. El sitio **no arranca** sin estas (fail-closed por seguridad). |
| `ADMIN_SECRET`, `ADMIN_PASSKEY` | Sí | Acceso al panel de administración. |
| `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` | Sí | Subida de fotos/video de verificación. |
| `NEXT_PUBLIC_SITE_URL` | Sí (tiene fallback) | URL pública usada en sitemap, robots.txt y enlaces generados. |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Recomendada | Antibot en formularios de registro/publicación. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | Recomendada | Envío real de códigos OTP por SMS. Sin esto, el código se genera pero no se entrega por SMS (solo queda el link de WhatsApp como canal alterno). |
| `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` | Recomendada | Checkout VIP con crypto. Sin esto, el flujo de pago automático no funciona. |
| `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` | Opcional | Concierge IA avanzado y avisos en vivo por Telegram. |

En producción (Vercel), configura las mismas variables en **Project Settings → Environment Variables**, separadas por entorno (Production / Preview / Development) según corresponda.

## Base de datos (Supabase)

Las migraciones viven en [`supabase/migrations/`](./supabase/migrations). Aplícalas contra tu proyecto con la [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref <tu-project-ref>
supabase db push
```

Verifica en el dashboard de Supabase (Database → Migrations) que todas estén aplicadas antes de considerar el entorno listo para producción.

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción (Next.js + TypeScript)
npm run start    # sirve el build de producción
npm run lint      # ESLint
```

## Despliegue

El proyecto está pensado para desplegarse en [Vercel](https://vercel.com). Conecta el repositorio, configura las variables de entorno de la tabla de arriba y despliega. Cloudflare se usa por delante del dominio para WAF/Turnstile — ver `wrangler.toml` si aplica.

## Seguridad

- RLS activa en todas las tablas sensibles (service role via `supabaseAdmin` para operaciones de administración, bypassa RLS deliberadamente).
- Turnstile validado siempre en servidor antes de aceptar publicaciones/registros.
- Webhooks de pago (`/api/webhooks/vip-pass`) verifican firma HMAC SHA-512 de NOWPayments.
- Sesión de administrador firmada con HMAC + expiración de 24h.

Antes de reportar cualquier incidente de seguridad públicamente, contacta primero al equipo del proyecto.
