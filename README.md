# Sabor Gourmet

Aplicación web de reservas de mesas para el restaurante Sabor Gourmet.

## Proyecto

El MVP permite:

- consultar disponibilidad sin registrarse;
- crear reservas públicas;
- asignar automáticamente una mesa compatible;
- mostrar un código de confirmación;
- administrar reservas y mesas desde un panel protegido.

Solo el administrador inicia sesión. El cliente no tiene cuenta en esta versión.

El alcance funcional está definido en [`docs/BRIEF.md`](docs/BRIEF.md). Las reglas de desarrollo están en [`AGENTS.md`](AGENTS.md).

## Estado actual

El repositorio es un scaffold inicial. Actualmente incluye:

- API Express con `GET /api/health`;
- configuración de entorno y sesiones;
- cliente Prisma para PostgreSQL;
- esquema y seed iniciales;
- frontend React con una pantalla visual de reserva;
- TailwindCSS configurado mediante Vite;
- Docker Compose para PostgreSQL local.

Todavía falta implementar la lógica del MVP: disponibilidad real, reservas, autenticación administrativa, panel admin y gestión de mesas.

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

## Reserva pública

La reserva no requiere `userId` de cliente. Guarda directamente nombre, apellido, email, fecha, horario, cantidad de personas, mesa y código de confirmación.

`User` queda reservado para la cuenta administrativa. El esquema Prisma actual todavía contiene una relación obligatoria `Reservation.userId`; debe alinearse antes de implementar reservas públicas reales.

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

- cuentas de clientes;
- edición o cancelación por clientes;
- emails, SMS y recordatorios;
- pagos;
- pedidos, delivery y menú;
- plano visual del salón;
- reportes y estadísticas.
