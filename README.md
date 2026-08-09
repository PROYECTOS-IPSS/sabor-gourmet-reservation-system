# Sabor Gourmet

Sistema web de gestión y reservas en línea para el restaurante **Sabor Gourmet**.

El proyecto busca modernizar el sistema manual de reservas del restaurante mediante una aplicación web que permita a los clientes consultar disponibilidad, realizar reservas y gestionar sus reservas, mientras que el personal del restaurante dispone de una interfaz administrativa para gestionar mesas y reservas.

---

## 📋 Descripción

**Sabor Gourmet** es una aplicación web responsiva desarrollada bajo una arquitectura **MVC**, orientada a la gestión de reservas de mesas en tiempo real.

El sistema permite:

- Consultar disponibilidad de mesas.
- Realizar reservas en línea.
- Modificar reservas existentes.
- Cancelar reservas.
- Consultar las reservas del cliente.
- Gestionar mesas desde un panel administrativo.
- Consultar y administrar las reservas actuales.
- Gestionar usuarios y sus permisos.
- Mantener una experiencia responsive en dispositivos móviles y escritorio.

El proyecto forma parte de la asignatura **Desarrollo de Software Web II** y es desarrollado colaborativamente mediante Git y un arnés agéntico basado en **Oh My Pi + OpenCode Go**.

---

# 🚀 Tecnologías

## Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- TypeScript
- Zod
- bcryptjs
- express-session

## Frontend

- React
- TypeScript
- TailwindCSS
- Vite

## Base de datos

- PostgreSQL
- Prisma ORM

## Desarrollo

- Nodemon
- ESLint
- Prettier
- Vitest
- Docker
- Docker Compose

---

# 🏗️ Arquitectura

El backend utiliza una arquitectura **MVC**, complementada con una capa de servicios para encapsular la lógica de negocio.

```text
                    ┌─────────────────┐
                    │     React       │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             │ HTTP / REST
                             ▼
                    ┌─────────────────┐
                    │     Routes      │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │   Controllers   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │    Services     │
                    │  Business Logic │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │     Models      │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Prisma Client   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

### Responsabilidades

#### Routes

Las rutas son responsables de:

- Definir endpoints.
- Ejecutar middlewares.
- Delegar la petición al controlador correspondiente.

Las rutas **no deben contener lógica de negocio ni consultas a Prisma**.

#### Controllers

Los controladores:

- Reciben las peticiones HTTP.
- Procesan el flujo de la petición.
- Ejecutan validaciones.
- Invocan los servicios correspondientes.
- Devuelven las respuestas HTTP.

#### Services

Los servicios contienen la lógica de negocio.

Ejemplos:

- Comprobar disponibilidad.
- Crear una reserva.
- Modificar una reserva.
- Cancelar una reserva.
- Validar reglas relacionadas con mesas.

#### Models

Los modelos encapsulan el acceso a datos mediante Prisma.

Los modelos:

- Ejecutan operaciones sobre la base de datos.
- No contienen lógica relacionada con HTTP.
- No renderizan vistas.

---

# 📁 Estructura del proyecto

```text
sabor-gourmet/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── reservation.controller.ts
│   │   ├── table.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── reservation.model.ts
│   │   └── table.model.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── reservation.service.ts
│   │   └── table.service.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── reservation.routes.ts
│   │   ├── table.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── reservation.schema.ts
│   │   ├── table.schema.ts
│   │   └── user.schema.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── reservation.types.ts
│   │
│   ├── utils/
│   │   ├── password.ts
│   │   └── date.ts
│   │
│   ├── views/
│   │   ├── auth/
│   │   ├── reservations/
│   │   ├── admin/
│   │   └── components/
│   │       └── ui/
│   │
│   ├── app.ts
│   └── server.ts
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── .env
├── .env.example
├── .gitignore
├── AGENTS.md
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

# Tipos de usuario

El sistema contempla dos roles principales.

## Cliente

El cliente puede:

- Registrarse.
- Iniciar sesión.
- Consultar disponibilidad.
- Crear reservas.
- Consultar sus reservas.
- Modificar reservas.
- Cancelar reservas.

## Administrador

El administrador puede:

- Consultar las reservas actuales.
- Gestionar mesas.
- Configurar la capacidad de las mesas.
- Activar o desactivar mesas.
- Consultar usuarios.
- Gestionar las reservas del restaurante.

---

# Modelo de datos

El sistema utiliza PostgreSQL mediante Prisma ORM.

Las principales entidades son:

```text
┌──────────────┐
│     User     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ passwordHash │
│ role         │
│ createdAt    │
│ updatedAt    │
│ deletedAt    │
└──────┬───────┘
       │
       │ 1:N
       │
       ▼
┌────────────────┐
│  Reservation   │
├────────────────┤
│ id             │
│ userId         │
│ tableId        │
│ date           │
│ startTime      │
│ endTime        │
│ guests         │
│ status         │
│ createdAt      │
│ updatedAt      │
│ deletedAt      │
└───────┬────────┘
        │
        │ N:1
        │
        ▼
┌──────────────┐
│    Table     │
├──────────────┤
│ id           │
│ number       │
│ capacity     │
│ isActive     │
│ createdAt    │
│ updatedAt    │
│ deletedAt    │
└──────────────┘
```

---

# Entidades

## User

Representa a los usuarios registrados en el sistema.

Roles disponibles:

```text
CUSTOMER
ADMIN
```

Las contraseñas nunca se almacenan directamente. Se utiliza `bcryptjs` para generar hashes seguros.

---

## Table

Representa las mesas disponibles en el restaurante.

Cada mesa posee:

- Número.
- Capacidad máxima.
- Estado activo/inactivo.
- Fecha de creación.
- Fecha de actualización.
- Fecha de eliminación lógica.

---

## Reservation

Representa una reserva realizada por un cliente.

Una reserva contiene:

- Cliente.
- Mesa.
- Fecha.
- Hora de inicio.
- Hora de término.
- Número de personas.
- Estado.

Estados disponibles:

```text
CONFIRMED
CANCELLED
COMPLETED
```

---

# Sistema de disponibilidad

La disponibilidad de una mesa depende de:

- Fecha solicitada.
- Hora de inicio.
- Hora de término.
- Capacidad de la mesa.
- Estado de la mesa.
- Reservas existentes.

Una mesa no puede ser asignada a dos reservas que se superpongan en el tiempo.

Por ejemplo:

```text
Reserva existente

19:00 ───────────── 20:00


Nueva reserva

       19:30 ───────────── 20:30




Nueva reserva

20:00 ───────────── 21:00


```

La lógica de disponibilidad pertenece a la capa de servicios y no debe implementarse directamente en las rutas o componentes del frontend.

---

# 🔌 API

## Autenticación

| Método | Endpoint             | Descripción                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Registrar usuario           |
| POST   | `/api/auth/login`    | Iniciar sesión              |
| POST   | `/api/auth/logout`   | Cerrar sesión               |
| GET    | `/api/auth/me`       | Obtener usuario autenticado |

---

## Reservas

| Método | Endpoint                | Descripción         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/reservations`     | Obtener reservas    |
| GET    | `/api/reservations/:id` | Obtener una reserva |
| POST   | `/api/reservations`     | Crear reserva       |
| PATCH  | `/api/reservations/:id` | Modificar reserva   |
| DELETE | `/api/reservations/:id` | Cancelar reserva    |

---

## Disponibilidad

```http
GET /api/reservations/availability
```

Ejemplo:

```http
GET /api/reservations/availability?date=2026-08-15&time=20:00&guests=4
```

Respuesta:

```json
{
  "available": true,
  "tables": [
    {
      "id": 3,
      "number": 3,
      "capacity": 4
    },
    {
      "id": 7,
      "number": 7,
      "capacity": 6
    }
  ]
}
```

---

## Mesas

| Método | Endpoint          | Descripción     |
| ------ | ----------------- | --------------- |
| GET    | `/api/tables`     | Obtener mesas   |
| POST   | `/api/tables`     | Crear mesa      |
| PATCH  | `/api/tables/:id` | Modificar mesa  |
| DELETE | `/api/tables/:id` | Desactivar mesa |

Las mesas no se eliminan físicamente.

---

# Seguridad

El sistema implementa diferentes mecanismos de seguridad.

### Contraseñas

Las contraseñas se almacenan utilizando:

```text
bcryptjs
```

Nunca se almacenan contraseñas en texto plano.

### Sesiones

La autenticación utiliza:

```text
express-session
```

### Validación

Toda información proveniente del usuario debe validarse utilizando:

```text
Zod
```

No se debe confiar directamente en:

```text
req.body
req.params
req.query
```

### Autorización

Las funcionalidades administrativas requieren el rol:

```text
ADMIN
```

### Soft Delete

Los registros eliminables utilizan:

```text
deletedAt
```

Los registros eliminados lógicamente no aparecen en las consultas normales.

---

# Responsive Design

La aplicación debe proporcionar una experiencia adecuada en:

- Smartphones
- Tablets
- Laptops
- Desktop

La interfaz será desarrollada utilizando **TailwindCSS**, priorizando un enfoque responsive y mobile-first.

---

# Instalación

## Requisitos

Antes de comenzar, instalar:

- Node.js
- npm
- PostgreSQL

Opcionalmente:

- Docker
- Docker Compose

---

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd sabor-gourmet
```

---

## Instalar dependencias

```bash
npm install
```

---

## Variables de entorno

Crear un archivo:

```text
.env
```

basado en:

```text
.env.example
```

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sabor_gourmet"

SESSION_SECRET="change-this-secret"

PORT=3000
NODE_ENV="development"
```

**Nunca subir `.env` al repositorio.**

---

# 🐘 Configuración de PostgreSQL

Crear la base de datos:

```sql
CREATE DATABASE sabor_gourmet;
```

Luego ejecutar las migraciones:

```bash
npx prisma migrate dev
```

Generar Prisma Client:

```bash
npx prisma generate
```

---

# Seed

Para cargar datos iniciales:

```bash
npx prisma db seed
```

El seed puede crear:

- Usuario administrador.
- Mesas iniciales.
- Datos necesarios para desarrollo.

---

# ▶Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

---

# Docker

Si se utiliza Docker Compose:

```bash
docker compose up -d
```

Para detener los servicios:

```bash
docker compose down
```

---

# Testing

Los tests se realizarán utilizando **Vitest**.

Ejecutar:

```bash
npm run test
```

Se dará especial prioridad a las pruebas relacionadas con:

- Disponibilidad de mesas.
- Creación de reservas.
- Modificación de reservas.
- Cancelación de reservas.
- Autenticación.
- Autorización.
- Validación de datos.

---

# Calidad de código

Ejecutar ESLint:

```bash
npm run lint
```

Formatear código:

```bash
npm run format
```

Verificar TypeScript:

```bash
npm run typecheck
```

Antes de realizar un commit se recomienda verificar:

```bash
npm run lint
npm run typecheck
npm run test
```

---

# Git Workflow

Nunca se debe trabajar directamente sobre `main`.

Cada funcionalidad debe desarrollarse mediante una rama independiente.

Ejemplos:

```text
feat/auth
feat/reservations
feat/availability
feat/tables
feat/admin
feat/frontend
fix/reservation-validation
fix/auth-session
refactor/reservation-service
```

Los commits deben ser pequeños y descriptivos.

Ejemplos:

```text
feat: add user registration
feat: implement reservation availability
feat: add table management
fix: prevent overlapping reservations
refactor: extract reservation business logic
```

---

# Trabajo colaborativo

El proyecto es desarrollado por dos integrantes.

Se recomienda dividir el trabajo por módulos para reducir conflictos.

### Integrante A

- Autenticación.
- Usuarios.
- Reservas.
- Disponibilidad.
- Backend.
- Prisma.

### Integrante B

- React.
- Diseño UI.
- Flujo de reservas.
- Dashboard administrativo.
- Gestión de mesas.
- Responsive design.

Las modificaciones a:

```text
prisma/schema.prisma
```

deben coordinarse entre ambos integrantes antes de crear nuevas migraciones.

---

# Desarrollo con agentes

El proyecto utiliza un arnés agéntico basado en:

- Oh My Pi
- OpenCode Go

Los agentes deben respetar estrictamente las convenciones definidas en [`AGENTS.md`](./AGENTS.md).

Antes de implementar una funcionalidad, se recomienda dividir el trabajo en tareas pequeñas y verificables.

Ejemplo:

```text
feat/reservations

1. Crear schema Zod
2. Crear modelo Prisma
3. Crear model de acceso a datos
4. Crear service
5. Crear controller
6. Crear route
7. Crear tests
8. Implementar interfaz React
9. Verificar responsive design
10. Ejecutar lint + typecheck + tests
```

Los agentes no deben implementar funcionalidades completas de forma monolítica cuando puedan dividirse en tareas independientes.

---

# Definition of Done

Una funcionalidad se considera terminada cuando:

- [ ] La entrada está validada mediante Zod.
- [ ] Existe tipado TypeScript adecuado.
- [ ] La lógica de negocio está fuera de las rutas.
- [ ] El acceso a Prisma está encapsulado en models.
- [ ] Las rutas están protegidas cuando corresponde.
- [ ] Se respetan los roles de usuario.
- [ ] Se utiliza soft delete cuando corresponde.
- [ ] La funcionalidad funciona en dispositivos móviles y escritorio.
- [ ] No existen errores de TypeScript.
- [ ] ESLint no reporta errores.
- [ ] Se agregaron tests cuando existe lógica de negocio relevante.
- [ ] El cambio está desarrollado en una rama específica.
- [ ] Los commits son descriptivos.
- [ ] La documentación se actualizó cuando corresponde.

---

# Roadmap

## Fase 1 — Infraestructura

- [ ] Configuración de Node.js + Express.
- [ ] Configuración de TypeScript.
- [ ] Configuración de Prisma.
- [ ] Configuración de PostgreSQL.
- [ ] ESLint.
- [ ] Prettier.
- [ ] Docker Compose.

## Fase 2 — Base de datos

- [ ] Modelo User.
- [ ] Modelo Table.
- [ ] Modelo Reservation.
- [ ] Migraciones.
- [ ] Seed.

## Fase 3 — Autenticación

- [ ] Registro.
- [ ] Login.
- [ ] Logout.
- [ ] Sesiones.
- [ ] Roles.
- [ ] Protección de rutas.

## Fase 4 — Reservas

- [ ] Consulta de disponibilidad.
- [ ] Creación de reservas.
- [ ] Consulta de reservas.
- [ ] Modificación.
- [ ] Cancelación.
- [ ] Validación de solapamientos.

## Fase 5 — Administración

- [ ] Dashboard.
- [ ] Gestión de reservas.
- [ ] Gestión de mesas.
- [ ] Activar/desactivar mesas.
- [ ] Gestión de usuarios.

## Fase 6 — Frontend

- [ ] Landing page.
- [ ] Login.
- [ ] Registro.
- [ ] Buscador de disponibilidad.
- [ ] Creación de reserva.
- [ ] Mis reservas.
- [ ] Dashboard administrativo.
- [ ] Gestión de mesas.
- [ ] Responsive design.

## Fase 7 — Seguridad y calidad

- [ ] Validación completa con Zod.
- [ ] Protección de sesiones.
- [ ] Autorización por roles.
- [ ] Manejo centralizado de errores.
- [ ] Tests unitarios.
- [ ] Tests de integración.
- [ ] Revisión de ESLint.
- [ ] Revisión de TypeScript.

---

# Objetivo del proyecto

El objetivo final es desarrollar una aplicación web moderna, segura, mantenible y responsive que permita al restaurante **Sabor Gourmet** reemplazar su sistema manual de reservas por una solución digital centralizada.

El proyecto busca aplicar conceptos de:

- Arquitectura MVC.
- Desarrollo web full-stack.
- APIs REST.
- ORM.
- Bases de datos relacionales.
- Autenticación y autorización.
- Validación de datos.
- Seguridad web.
- Control de versiones.
- Trabajo colaborativo.
- Desarrollo asistido por agentes.
- Diseño responsive.
- Testing y calidad de software.

---

## Licencia

Proyecto académico desarrollado para **Desarrollo de Software Web II**.
