# Sabor Gourmet

Aplicación web de reservas de mesas para el restaurante Sabor Gourmet.

## Proyecto

El MVP permite:

- consultar disponibilidad sin registrarse;
- registrarse e iniciar sesión como cliente;
- crear, modificar y cancelar reservas propias;
- asignar automáticamente una mesa compatible;
- mostrar un código de confirmación;
- administrar cualquier reserva y gestionar mesas desde un panel protegido.

El visitante consulta disponibilidad sin cuenta. El cliente se autentica para reservar y gestionar sus reservas. El administrador tiene control total.

El alcance funcional está en [`docs/BRIEF.md`](docs/BRIEF.md), las reglas de desarrollo en [`AGENTS.md`](AGENTS.md) y el diseño visual en [`docs/DESIGN.md`](docs/DESIGN.md).


## Estado actual

El repositorio es un scaffold inicial. Actualmente incluye:

- API Express con `GET /api/health`;
- configuración de entorno y sesiones;
- cliente Prisma para PostgreSQL;
- esquema y seed iniciales;
- frontend React con una pantalla visual de reserva;
- TailwindCSS configurado mediante Vite;
- Docker Compose para PostgreSQL local.

Todavía falta implementar la lógica del MVP: disponibilidad real, autenticación de clientes y administrador, reservas, panel admin y gestión de mesas.

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
Models + Prisma Client
      ↓
PostgreSQL
```

- **React:** vistas y componentes.
- **Routes:** endpoints y middlewares.
- **Controllers:** entrada y salida HTTP.
- **Services:** reglas de negocio.
- **Models:** acceso a datos mediante Prisma.
- **Schemas:** validación con Zod.
- **Middleware:** sesiones, autorización, validación y errores.

## Stack

- Node.js, Express.js y TypeScript.
- React, TypeScript, TailwindCSS y Vite.
- PostgreSQL y Prisma ORM.
- Zod, `bcryptjs` y `express-session`.
- Yarn, `tsx watch`, ESLint, Prettier, Vitest y Oxlint.
- Docker Compose opcional.

## Estructura

```text
sabor-gourmet/
├── docs/BRIEF.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── generated/prisma/
├── frontend/
│   ├── src/
│   └── package.json
├── AGENTS.md
├── docker-compose.yml
└── package.json
```

Las carpetas `controllers`, `services` y `schemas` se agregarán cuando se implementen las funcionalidades correspondientes. No se crean capas vacías.

## Reserva

La reserva requiere `userId` del cliente autenticado. Los datos de contacto (nombre, email) se toman del perfil de `User`.

Cada reserva genera un `confirmationCode` único al confirmarse. El esquema Prisma actual ya contiene la relación `Reservation.userId → User`. Solo falta agregar el campo `confirmationCode`.

## Instalación

### Requisitos

- Node.js.
- Yarn.
- Docker, opcional.

### Backend

```bash
yarn install
```

Crear `.env` a partir de `.env.example` y configurar `DATABASE_URL` y `SESSION_SECRET`.

Con PostgreSQL local mediante Docker:

```bash
docker compose up -d
yarn db:generate
yarn db:migrate
yarn db:seed
yarn dev
```

API actual:

```text
http://localhost:3000/api/health
```

### Frontend

En otra terminal:

```bash
cd frontend
yarn install
yarn dev
```

Frontend por defecto: `http://localhost:5173`.

## Comandos

Backend, desde la raíz:

```bash
yarn typecheck
yarn lint
yarn test
yarn build
```

Frontend, desde `frontend/`:

```bash
yarn typecheck
yarn lint
yarn build
```

## Fuera del MVP

- Reservas sin cuenta de cliente.
- Modificación o cancelación sin autenticación.
- Emails, SMS y recordatorios.
- Pagos.
- Pedidos, delivery y menú.
- Plano visual del salón.
- Reportes y estadísticas.
