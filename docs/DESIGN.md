# DESIGN.md — Sabor Gourmet

## Propósito

Este documento define la identidad visual del proyecto para que cualquier agente pueda construir interfaces consistentes usando `skill://frontend-design` y TailwindCSS.

## Dirección visual

Restaurante moderno, simple y atractivo. La interfaz debe sentirse contemporánea sin ser fría: fondo oscuro con acentos cálidos, tipografía con carácter y espacio generoso. La comida y el ambiente del restaurante son los protagonistas.

## Reglas para agentes

1. Antes de crear o modificar cualquier vista, leer este documento completo.
2. Usar `skill://frontend-design` para decisiones de paleta, tipografía, layout y elementos distintivos.
3. Implementar con TailwindCSS. No usar CSS plano salvo que Tailwind no cubra el caso.
4. Usar gradientes sutiles, texturas CSS o fotografía cuando exista un asset disponible; no crear pantallas planas sin intención visual.
5. Diseñar mobile-first. Todo debe funcionar en escritorio, tableta y móvil.
6. Respetar foco visible, navegación por teclado, contraste suficiente y `prefers-reduced-motion`.
7. No usar placeholders ni colores genéricos de framework. Cada tono debe salir de la paleta definida aquí.

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| Fondo principal | `#1b1714` | Body, shell, secciones principales |
| Texto principal | `#f4efe7` | Títulos, cuerpo de texto sobre fondo oscuro |
| Acento dorado | `#d2a653` | Botones, links, highlights, íconos activos |
| Bronce | `#8c5c2e` | Detalles secundarios, hover de botones oscuros |
| Texto muted | `#b7aaa0` | Texto secundario, navegación |
| Texto muted 2 | `#a99b91` | Texto terciario, descripciones |
| Texto muted 3 | `#6c5c51` | Labels sobre panel claro |
| Borde sutil | `#3a3029` | Separadores, bordes de sección |
| Borde medio | `#685544` | Bordes de inputs, botones outline |
| Borde claro | `#b5a694` | Bordes sobre fondo claro |
| Panel claro | `#e4d9ca` | Panel de reserva, formularios, cards |
| Fondo nota | `#28211d` | Cards destacadas, callouts |
| Fondo footer | `#776b63` | Texto de footer |

### Modo claro (panel de reserva)

Cuando un componente tenga fondo `#e4d9ca`:

- Texto principal: `#1b1714`
- Labels y eyebrow: `#8c5c2e`
- Bordes de input: `#b5a694`
- Botón principal: `#1b1714` con texto `#f4efe7`

## Tipografía

| Rol | Familia | Peso | Uso |
|---|---|---|---|
| Display | Playfair Display | 500, 600 | H1, H2, H3, números grandes, citas |
| Body | Space Grotesk | 400, 500, 600 | Texto general, navegación, inputs |
| Utility | DM Mono | 400, 500 | Labels, eyebrows, badges, botones pequeños, footer |

## Layout

- Ancho máximo: `1440px` centrado con `margin: 0 auto`.
- Padding horizontal: `6vw` para navegación, `13vw` para secciones, `9vw` en móvil.
- Secciones separadas por bordes finos (`1px solid #3a3029`).
- Espacio generoso entre secciones, sin saturar.
- Grid de features: 3 columnas en escritorio, apilado en móvil.
- Panel de reserva: layout de dos columnas (heading + form), apilado en móvil.

## Assets

El MVP actual no depende de archivos gráficos externos. Las superficies visuales usan TailwindCSS, gradientes sutiles, bordes y la tipografía definida arriba. Si se agregan assets, deben ubicarse en `frontend/src/assets/` o `frontend/public/` y documentarse aquí.

## Vistas del MVP

### Público

| Vista | Descripción |
|---|---|
| Inicio | Hero, navegación, acceso a disponibilidad |
| Disponibilidad | Formulario de búsqueda: fecha, horario, personas. Resultados claros |
| Login | Formulario limpio, centrado, sin distracciones |
| Registro | Similar a login, con campos necesarios |

### Cliente autenticado

| Vista | Descripción |
|---|---|
| Reservar | Formulario completo con resumen antes de confirmar |
| Confirmación | Código único, datos de la reserva, opción de volver al inicio |
| Mis reservas | Listado con estado y acciones por reserva |
| Editar reserva | Mismo formulario de creación, fecha/hora/personas; mesa reasignada automáticamente |
| Cancelar | Confirmación de cancelación con resumen |

### Administrador

| Vista | Descripción |
|---|---|
| Dashboard | Resumen de reservas del día |
| Reservas | Tabla o lista con filtros, acciones de editar y cancelar |
| Mesas | Lista de mesas con crear, editar, activar/desactivar |
| Editar mesa | Formulario de número y capacidad |

## Estados de interfaz

Toda vista debe contemplar:

| Estado | Qué mostrar |
|---|---|
| Vacío | Texto orientador y acción siguiente |
| Carga | Skeleton o spinner sutil, sin flickering |
| Error | Mensaje claro, específico y accionable. Nunca "Error desconocido" |
| Éxito | Confirmación visible con resumen, sin desvanecer automáticamente |
| Deshabilitado | Botones e inputs con opacidad reducida y `cursor: not-allowed` |

## Componentes reutilizables

| Componente | Dónde se usa |
|---|---|
| Topbar | Navegación principal en todas las vistas |
| Footer | Pie de página en todas las vistas |
| Booking form | Formulario de búsqueda de disponibilidad |
| Time slot picker | Selector de horarios en intervalos de 30 min |
| Reservation card | Resumen de reserva en listados |
| Status badge | Chip de estado |
| Confirmation code | Código único destacado |
| Empty state | Mensaje para listas vacías |
| Error alert | Banner de error con acción |
