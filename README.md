# Sabor Gourmet

Aplicación web de reservas para restaurante. Permite consultar disponibilidad, registrar clientes, crear y administrar reservas, y gestionar mesas desde un panel protegido.

## Alcance implementado

- Disponibilidad pública sin iniciar sesión.
- Registro público como `CUSTOMER`.
- Login y logout con `express-session`.
- Sesión mediante cookie `HTTP-only`.
- Asignación automática de mesa activa según capacidad y horario.
- Duración fija de 90 minutos.
- Horarios cada 30 minutos, miércoles a domingo, de 18:00 a 21:30.
- Validación de fechas pasadas, capacidad y solapamientos en servidor.
- Creación, consulta, modificación y cancelación de reservas propias.
- Código único de confirmación.
- Cancelación lógica: la reserva no se elimina físicamente.
- Dashboard para `ADMIN` y `EMPLOYEE`.
- `EMPLOYEE`: lectura de mesas, clientes y reservas.
- `ADMIN`: creación, edición y desactivación de mesas; creación, edición y cancelación de reservas.
- Rutas frontend `/carta`, `/experiencia`, `/reservar`, `/mis-reservas`, `/login` y `/registrarse`.

## Roles demo

Todos usan contraseña `admin1234` en desarrollo local:

| Usuario | Email | Rol |
|---|---|---|
| Administrador | `admin@saborgourmet.local` | `ADMIN` |
| María | `empleado@saborgourmet.local` | `EMPLOYEE` |
| Carlos | `carlos@saborgourmet.local` | `CUSTOMER` |
| Ana | `ana@saborgourmet.local` | `CUSTOMER` |
| Luis | `luis@saborgourmet.local` | `CUSTOMER` |
| Sofía | `sofia@saborgourmet.local` | `CUSTOMER` |

La contraseña es únicamente para desarrollo. No usarla en producción.

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

- **React:** vistas, formularios, navegación y estado visual.
- **Routes:** endpoints y middlewares.
- **Controllers:** entrada y salida HTTP.
- **Services:** reglas de autenticación, disponibilidad, asignación y reservas.
- **Models:** acceso a PostgreSQL mediante Prisma.
- **Schemas:** validación Zod.
- **Middleware:** sesión, autorización, validación y errores.

## Endpoints

### Salud y autenticación

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/dashboard                 ADMIN o EMPLOYEE
```

`GET /api/health` verifica también la conexión con PostgreSQL y responde `database: "ok"` cuando está disponible.

### Reservas de clientes

```text
POST /api/reservations/availability  Público
POST /api/reservations                CUSTOMER
GET  /api/reservations/mine           CUSTOMER
PATCH /api/reservations/:id           CUSTOMER propietario
POST /api/reservations/:id/cancel     CUSTOMER propietario
```

El cliente envía fecha, hora y cantidad de personas. No envía una mesa como decisión definitiva; el servidor asigna una mesa disponible.

### Administración

```text
GET    /api/admin/customers                 ADMIN o EMPLOYEE
GET    /api/admin/tables                    ADMIN o EMPLOYEE
POST   /api/admin/tables                    ADMIN
PATCH  /api/admin/tables/:id                ADMIN
DELETE /api/admin/tables/:id                ADMIN
GET    /api/admin/reservations              ADMIN o EMPLOYEE
POST   /api/admin/reservations              ADMIN
PATCH  /api/admin/reservations/:id          ADMIN
POST   /api/admin/reservations/:id/cancel   ADMIN
```

Todos los parámetros, cuerpos y queries que corresponden están validados con Zod.

## Base de datos

PostgreSQL y Prisma ORM.

El seed actual crea:

- 6 usuarios demo: 1 administrador, 1 empleado y 4 clientes.
- 12 mesas activas.
- 20 reservas demo consistentes con la capacidad de cada mesa.

`prisma/seed.ts` usa `upsert` para reservas demo y evita duplicados al ejecutarse nuevamente.

## Instalación

### Requisitos

- Node.js.
- Yarn 1.x.
- PostgreSQL.
- Docker Desktop opcional.

### Variables de entorno

Copiar `.env.example` como `.env`:

```bash
copy .env.example .env
```

En macOS/Linux:

```bash
cp .env.example .env
```

Configurar como mínimo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sabor_gourmet?schema=public"
SESSION_SECRET="cambia-este-secreto-por-uno-de-16-caracteres-o-mas"
```

`.env` está excluido de Git. Nunca subir secretos. `.env.example` sí debe permanecer versionado.

### PostgreSQL con Docker

```bash
docker compose up -d
```

### Backend

Desde la raíz:

```bash
yarn install
yarn db:generate
yarn db:migrate
yarn db:seed
yarn dev
```

`yarn db:migrate` puede solicitar nombre para una migración nueva en desarrollo. Para una base vacía, usar `init`.

API:

```text
http://localhost:3000
```

Health check:

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

Vite mostrará la URL disponible, normalmente:

```text
http://localhost:5173
```

Si el puerto está ocupado, Vite puede usar `5174`.

## Verificación

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
yarn build
```

Estado verificado actualmente:

- Backend typecheck: pasa.
- Backend lint: pasa.
- Tests: 11 pruebas exitosas.
- Frontend typecheck: pasa.
- Frontend build: pasa.

## Documentación relacionada

- [Brief funcional](docs/BRIEF.md)
- [Guía de agentes](AGENTS.md)
- [Diseño visual](docs/DESIGN.md)
- [Brief de login](docs/LOGIN-BRIEF.md)
- [Brief de reserva](docs/RESERVA-BRIEF.md)
- [Informe técnico](INFORME.md)

## Fuera del MVP

- Reservas sin cuenta de cliente.
- Modificación o cancelación sin autenticación.
- Emails, SMS y recordatorios.
- Pagos.
- Pedidos, delivery y menú.
- Plano interactivo del salón.
- Reportes y estadísticas.
