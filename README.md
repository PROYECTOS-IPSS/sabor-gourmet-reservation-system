# Sabor Gourmet

Aplicación web de reservas de mesas para el restaurante Sabor Gourmet.

## Proyecto

El MVP implementado permite:

- consultar disponibilidad de mesas sin registrarse;
- registrarse como cliente con nombre, apellido y correo;
- iniciar y cerrar sesión mediante cookies de `express-session`;
- redirigir clientes a `/reservar` y administradores/empleados a `/dashboard`;
- asignar automáticamente una mesa activa con capacidad suficiente;
- validar reservas y evitar solapamientos;
- proteger el dashboard con sesión y roles `ADMIN` o `EMPLOYEE`;
- mostrar mesas, capacidades y estado en la pantalla de reserva;
- administrar la base mediante Prisma, migraciones y seed.

El cliente público no necesita cuenta para consultar disponibilidad. El registro crea una sesión `CUSTOMER` y dirige a `/reservar`.

El alcance funcional está en [`docs/BRIEF.md`](docs/BRIEF.md), las reglas de desarrollo en [`AGENTS.md`](AGENTS.md) y las notas del flujo en [`docs/LOGIN-BRIEF.md`](docs/LOGIN-BRIEF.md).

## Estado actual

La aplicación cuenta con API Express, autenticación por sesión, validación Zod, disponibilidad real contra PostgreSQL, seed de datos demo, pantalla de reservas y panel administrativo.

Incluye gestión administrativa de mesas y reservas, asignación automática, cancelación lógica y códigos únicos de confirmación.

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

- **React:** vistas, formularios, estado de sesión y navegación.
- **Routes:** endpoints y middlewares.
- **Controllers:** entrada y salida HTTP.
- **Services:** autenticación y disponibilidad.
- **Models:** acceso a datos mediante Prisma.
- **Schemas:** validación con Zod.
- **Middleware:** sesión, autorización, validación y errores.

## Endpoints actuales

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/dashboard              ADMIN o EMPLOYEE
POST /api/reservations/availability
```

## Datos iniciales

`prisma/seed.ts` crea usuarios demo, 40 mesas activas con capacidades de 1 a 8 personas y reservas de ejemplo. Las contraseñas demo son solo para desarrollo local.

El modelo `User` incluye `name`, `apellido`, `email`, `passwordHash` y `role`. `Reservation` relaciona usuario y mesa y conserva estado de reserva.


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
yarn prisma migrate dev
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
