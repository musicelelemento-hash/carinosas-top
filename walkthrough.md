# Walkthrough: mejora de portada

## Cambios visibles

- Portada con un título editorial y una explicación breve del catálogo.
- Tarjetas más sobrias: menos brillo, mejor jerarquía, contacto consistente y enlaces de perfil accesibles con teclado.
- Los perfiles sin foto usan un estado neutral en vez de una fotografía de stock.
- Solo se muestra «En línea» cuando ese estado está registrado. Las tarjetas sin WhatsApp no ofrecen un enlace vacío.
- En móvil, «En tu ciudad», «En línea» y «Esta semana» aplican filtros reales; se retiró la tarjeta duplicada de contacto y el conteo parcial presentado como total.
- Se añadieron estados de carga, error y reintento; la interfaz respeta la preferencia de movimiento reducido.

## Verificación

- `npx tsc --noEmit`: correcto.
- ESLint en los cuatro componentes/librerías de interfaz: correcto.
- `git diff --check`: correcto.
- Build: pendiente por falta de resolución de `fonts.googleapis.com` y error de permisos al crear `.next/types/app/api`.
- Playwright: no ejecutado tras este cambio; el servidor de desarrollo superó su tiempo de inicio en el intento anterior.

La migración de permisos de Supabase fue ejecutada por el usuario y devolvió «Success · No rows returned».
