# AGENTS.md — Sabor Gourmet

## Propósito

Esta guía define cómo implementar el MVP descrito en `docs/BRIEF.md`.

- `docs/BRIEF.md` define **qué** debe hacer el producto.
- `AGENTS.md` define **cómo** debe construirse.

Si hay una contradicción, informar antes de implementar. No agregar alcance por iniciativa propia.

## Stack obligatorio

- Backend: Node.js, Express.js y TypeScript.
- Base de datos: PostgreSQL y Prisma ORM.
- Frontend: React, TypeScript, TailwindCSS y Vite.
- Validación: Zod.
- Seguridad: `bcryptjs` y `express-session`.
- Desarrollo: Yarn, `tsx watch`, ESLint, Prettier y Vitest.
- Docker Compose es opcional.

Nodemon puede reemplazar `tsx watch`, pero no se deben usar ambos. No agregar dependencias innecesarias.

## Arquitectura MVC

```text
React / vistas
      ↓ HTTP / REST
Routes + middlewares
      ↓
Controllers
      ↓
Services
      ↓
Models + Prisma
      ↓
PostgreSQL
```

### Frontend

React contiene vistas, componentes y estado de interfaz. No decide de forma definitiva disponibilidad, permisos ni estado de reservas.

Las vistas nuevas deben ser responsive, accesibles con teclado y construidas con TailwindCSS. Para cambios visuales consultar `skill://frontend-design`.

### Routes

Define endpoints y conecta middlewares con controllers. No contiene lógica de negocio ni acceso a Prisma.

### Controllers

Recibe la petición HTTP, usa datos validados, llama al service y devuelve JSON. No contiene consultas Prisma ni reglas complejas.

### Services

Contiene la lógica de negocio: disponibilidad, asignación de mesa, creación, edición, cancelación y autenticación de administrador.

### Models

Contiene todo acceso a Prisma y PostgreSQL. No conoce Express ni React.

### Schemas

Contiene esquemas Zod para validar `body`, `params` y `query`.

### Middleware

Contiene validación, sesión, autorización de administrador y manejo de errores.

## Estructura mínima

```text
prisma/
├── migrations/
├── schema.prisma
└── seed.ts

src/
├── app.ts
├── server.ts
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── schemas/
└── services/

frontend/src/
├── App.tsx
├── components/
├── views/
└── services/
```

Crear archivos solo cuando una funcionalidad los necesite. Reutilizar patrones existentes.

## Reglas técnicas del MVP

- Las reservas públicas no requieren cuenta, sesión ni `userId` de cliente.
- Solo el administrador usa autenticación y sesión.
- `User` representa únicamente cuentas administrativas en este MVP.
- `Reservation` guarda nombre, apellido y email directamente.
- No crear usuarios falsos para reservas públicas.
- El administrador inicial se crea con `prisma seed`.
- El servidor asigna automáticamente la mesa.
- Cada reserva dura 90 minutos.
- Los horarios comienzan cada 30 minutos, de miércoles a domingo.
- Solo mesas activas y con capacidad suficiente participan.
- Nunca se confirma una reserva superpuesta.
- La comprobación y escritura deben evitar doble reserva concurrente.
- Cancelar cambia a `CANCELLED`; no se hace hard delete.
- No implementar funciones fuera del brief.

### Modelo de reserva pública

Una reserva pública es válida sin usuario porque identifica al cliente mediante datos de contacto, no mediante autenticación:

```text
Reservation
├── firstName
├── lastName
├── email
├── confirmationCode
├── tableId
├── date
├── startTime
├── endTime
├── guests
└── status
```

En este MVP no debe existir una relación obligatoria `Reservation.userId -> User`. `User` queda reservado para la sesión del administrador.

## Validación y seguridad

- Validar con Zod todo `req.body`, `req.params` y `req.query`.
- Nunca confiar en datos enviados por React.
- No usar `any` sin justificación.
- Guardar contraseñas solo como hash con `bcryptjs`.
- Proteger únicamente las rutas administrativas con sesión y autorización.
- Las rutas públicas de disponibilidad y creación no requieren sesión.
- El cliente no puede decidir rol, estado, disponibilidad ni mesa.
- No registrar contraseñas, sesiones ni secretos.
- Mantener secretos en variables de entorno.
- Usar Prisma Client; SQL manual solo con justificación.

## Principios de calidad

El código debe ser:

- limpio y autoexplicativo;
- ordenado y fácil de leer;
- guiado por los principios SOLID:
  - **S**ingle Responsibility: cada función, clase y módulo tiene una sola razón para cambiar;
  - **O**pen/Closed: las entidades deben estar abiertas a extensión, cerradas a modificación;
  - **L**iskov Substitution: las subclases deben ser sustituibles por sus clases base;
  - **I**nterface Segregation: interfaces pequeñas y específicas, no genéricas;
  - **D**ependency Inversion: depender de abstracciones, no de implementaciones concretas.
- Preferir composición sobre herencia.
- Mantener funciones pequeñas, con un solo propósito.
- Nombrar variables, funciones y archivos de forma descriptiva.
- Evitar comentarios que repitan lo que el código ya dice.
- Eliminar código muerto, imports sin usar y variables no referenciadas.

## Dependencias y documentación

- Antes de agregar cualquier librería nueva, consultar documentación oficial con **MCP Context7** o **web search**.
- Verificar que la dependencia sea necesaria: si el stack actual o una función nativa resuelven el problema, no agregarla.
- Preferir dependencias con buena documentación, mantenimiento activo y licencia compatible.
- Al usar una API de librería por primera vez, consultar su documentación más reciente.
- No instalar librerías deprecadas o sin mantenimiento.

## Git y trabajo colaborativo

- No trabajar directamente sobre `main`.
- Usar ramas descriptivas según el cambio, por ejemplo `feat/public-reservation`, `feat/admin-reservations`, `feat/table-management` o `fix/availability`.
- Mantener commits pequeños y descriptivos.
- Coordinar cambios en `prisma/schema.prisma` y sus migraciones.
- No mezclar formateo masivo con funcionalidades.

## Protocolo de agentes

Antes de editar:

1. Leer `docs/BRIEF.md` y esta guía.
2. Revisar código relacionado y patrones existentes.
3. Localizar referencias afectadas.
4. Consultar documentación oficial de cualquier librería o API desconocida mediante MCP Context7 o web search.

Al implementar:

1. Mantener el flujo MVC.
2. Validar entradas en servidor con Zod.
3. Colocar reglas en services.
4. Colocar Prisma en models.
5. Mantener el alcance mínimo del brief.
6. No dejar stubs, mocks, no-ops ni código muerto.

## Definition of Done

- [ ] Cumple `docs/BRIEF.md`.
- [ ] Entradas validadas con Zod.
- [ ] Tipado TypeScript correcto.
- [ ] Routes sin lógica de negocio ni Prisma.
- [ ] Services con reglas de negocio.
- [ ] Models con acceso a Prisma.
- [ ] Rutas administrativas protegidas.
- [ ] No existe hard delete.
- [ ] No se permiten reservas superpuestas.
- [ ] Interfaz usable en móvil y escritorio.
- [ ] Typecheck, lint y pruebas relevantes pasan.

## Prohibiciones

No:

- romper MVC;
- acceder a Prisma desde routes, controllers o React;
- omitir Zod;
- guardar contraseñas sin hash;
- confiar en el frontend;
- eliminar reservas físicamente;
- agregar cuentas de clientes, notificaciones, pagos o reportes al MVP;
- agregar dependencias sin necesidad;
- dejar implementaciones falsas o incompletas.
