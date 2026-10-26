# Estado de mejoras del catálogo y confianza

## Mejora de interfaz aplicada

Objetivo: hacer que la portada se sienta más editorial y ordenada, reducir etiquetas y efectos que distraen, y asegurar que acciones visibles (filtros, estado y contacto) correspondan a información real.

- `[MODIFY]` `src/components/HomePageClient.tsx`: añadir encabezado de portada claro y conectar filtros rápidos móviles con la búsqueda del servidor.
- `[MODIFY]` `src/components/MobileHomeFeed.tsx`: reducir chips a filtros reales, quitar el perfil/contacto duplicado y falso conteo de actividad.
- `[MODIFY]` `src/components/ProfileCard.tsx`: limpiar la tarjeta, hacer el acceso al perfil accesible por teclado, mostrar estado únicamente cuando existe y usar placeholder neutral sin foto real.
- `[MODIFY]` `src/lib/modelCatalog.ts`: admitir límite por fecha para el filtro semanal y no asignar fotos o notas de stock a perfiles sin esos datos.
- `[MODIFY]` `src/app/globals.css`: respetar preferencia de movimiento reducido y tema oscuro del sistema.

Riesgo principal: mantener compatibles las tarjetas de páginas de ciudad y el cursor paginado al combinar ciudad, disponibilidad y fecha.

Verificación: tipos y ESLint en los componentes de interfaz pasaron; la compilación encontró falta de acceso de red para descargar fuentes de Google y un error de permisos en `.next`.

## Implementado

- Catálogo con páginas de 24 perfiles y cursor keyset validado por fecha e identificador.
- Búsqueda y filtros en servidor (ciudad, etiqueta, disponibilidad, verificación, plan, tarifa y fecha), con protección contra respuestas fuera de orden.
- Eliminación de perfiles de demostración y datos inventados en semillas, historias, métricas, reseñas y conteos.
- Verificación de reseñas solo cuando se confirma un pase vigente y una reserva completada.
- Duplicar perfiles no conserva cuenta asociada, consentimiento, verificación ni disponibilidad.
- Los enlaces de WhatsApp dependen de números configurados; la plantilla de entorno no anuncia un teléfono ficticio.
- Migración SQL aplicada por el usuario en Supabase («Success · No rows returned»).
- Pruebas de navegación críticas añadidas en `tests/e2e-critical.spec.ts`.

## Comprobaciones realizadas

- `npx tsc --noEmit`: correcto (código de salida 0).
- ESLint en `ProfileCard`, `MobileHomeFeed`, `HomePageClient` y `modelCatalog`: correcto, sin errores ni advertencias.
- `git diff --check`: correcto; Git muestra avisos de normalización LF/CRLF de Windows.
- `npm run build`: Webpack informó `getaddrinfo ENOTFOUND fonts.googleapis.com` al descargar fuentes y después `EPERM` creando `.next/types/app/api`.
- `npx playwright test`: no ejecutado tras esta iteración; el servidor local superó su tiempo de inicio en el intento anterior.

## Pendiente

- Repetir build y pruebas de navegación cuando el entorno pueda descargar las fuentes o se alojen localmente y se corrijan los permisos de `.next`.
