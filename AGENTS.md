# AGENTS.md

# Sabor Gourmet - Desarrollo de Software Web II

## Objetivo del proyecto

Desarrollar una aplicación web utilizando una arquitectura MVC para la administración de usuarios reservas en línea para el Restaurante "Sabor Gourmet", aplicando buenas prácticas de desarrollo de software, seguridad, validación de datos y trabajo colaborativo mediante Git.

Este proyecto está siendo desarrollado por dos integrantes utilizando un arnés agéntico (Oh My Pi + OpenCode Go), por lo que todos los agentes deben respetar estrictamente las convenciones descritas en este documento.

---

# Stack tecnológico

## Backend

- Node.js
- Express.js
- TypeScript

## Base de datos

- Prisma ORM
- PostgreSQL

## Frontend

- React
- TailwindCSS

## Validaciones

- Zod

## Seguridad

- bcryptjs
- express-session

## Desarrollo

- Nodemon

## Opcional

- Docker
- Docker Compose

---

# Arquitectura

El proyecto sigue una arquitectura MVC.

```
React
   ↓
REST API
   ↓
Express
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
Prisma
   ↓
PostgreSQL
```

Cada capa tiene una responsabilidad específica.

Ejemplo:

```

frontend/
└── views/
    ├── auth/
    ├── reservations/
    ├── admin/
    └── components/
        └── ui/
src/
│
├── app.ts
├── server.ts
│
├── config/
│   └── env.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── reservation.controller.ts
│   ├── table.controller.ts
│   └── user.controller.ts
│
├── models/
│   ├── user.model.ts
│   ├── reservation.model.ts
│   └── table.model.ts
│
├── services/
│   ├── auth.service.ts
│   ├── reservation.service.ts
│   └── table.service.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── reservation.routes.ts
│   ├── table.routes.ts
│   └── user.routes.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── admin.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── schemas/
│   ├── auth.schema.ts
│   ├── reservation.schema.ts
│   ├── table.schema.ts
│   └── user.schema.ts
│
├── types/
│   ├── auth.types.ts
│   └── reservation.types.ts
│
├── utils/
│   ├── password.ts
│   └── date.ts
│
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

---

# Módulos de la aplicación

Sabor Gourmet
│
├── Autenticación
│ ├── Registro
│ ├── Login
│ ├── Logout
│ └── Sesiones
│
├── Cliente
│ ├── Ver disponibilidad
│ ├── Crear reserva
│ ├── Ver mis reservas
│ ├── Modificar reserva
│ └── Cancelar reserva
│
├── Reservas
│ ├── Disponibilidad
│ ├── Crear
│ ├── Modificar
│ ├── Cancelar
│ └── Historial
│
├── Mesas
│ ├── Ver mesas
│ ├── Crear mesa
│ ├── Modificar mesa
│ ├── Desactivar mesa
│ └── Configurar capacidad
│
└── Administración
├── Dashboard
├── Reservas actuales
├── Gestión de mesas
└── Gestión de usuarios

## Disponibilidad de reservas/mesas

Mesa disponible ≠ reserva disponible.

La disponibilidad debe calcularse considerando:

fecha
hora
duración de la reserva
capacidad de la mesa
reservas existentes
estado de la mesa

# Responsabilidades de cada carpeta

## controllers/

Los controladores:

- reciben la petición
- validan el flujo
- llaman al modelo correspondiente
- renderizan vistas
- realizan redirecciones

Los controladores NO deben contener consultas SQL ni lógica de Prisma.

---

## models/

Los modelos contienen la lógica de acceso a datos.

Toda interacción con Prisma debe realizarse desde esta capa.

Los modelos NO deben renderizar vistas.

---

## routes/

Las rutas únicamente:

- reciben la petición
- ejecutan middlewares
- llaman al controlador correspondiente

Las rutas NO deben contener lógica de negocio.

---

## middleware/

Contiene middleware como:

- autenticación
- autorización
- manejo de sesiones
- protección de rutas

---

## schemas/

Contiene exclusivamente esquemas de validación Zod.

Ejemplo:

```
user.schema.ts

game.schema.ts

auth.schema.ts
```

---

## prisma/

Contiene:

- schema.prisma
- migrations
- seed.ts

---

## views/

Las vistas están organizadas por módulos. Usa siempre la skill /frontend-design

Ejemplo:

```
views/

auth/

users/

reservations/

components/
  /ui

```

---

## public/

Archivos estáticos.

```
css/

js/

images/
```

---

# Convenciones de código

## TypeScript

Siempre utilizar tipado.

Evitar el uso de:

```
any
```

Siempre que sea posible utilizar interfaces o tipos.

---

## Async

Toda operación de base de datos debe utilizar:

```
async/await
```

Evitar callbacks.

---

## Nombres

Usar eslint para estandarización del codigo

Variables

```
camelCase
```

Clases

```
PascalCase
```

Archivos

```
user.controller.ts

user.model.ts

user.routes.ts

user.schema.ts
```

---

## Funciones

Las funciones deben ser pequeñas y con una única responsabilidad.

Evitar funciones extremadamente largas.

---

# Validaciones

Toda información proveniente del usuario debe validarse mediante Zod antes de ser procesada.

Nunca confiar en:

- req.body
- req.params
- req.query

Utilizar:

```
safeParse()
```

cuando corresponda.

---

# Seguridad

Las contraseñas nunca deben almacenarse en texto plano.

Siempre utilizar:

- bcryptjs

con hash + salt.

---

# Base de datos

La aplicación utiliza Prisma ORM.

No escribir SQL manual salvo que sea absolutamente necesario.

Preferir siempre Prisma Client.

---

# Soft Delete

Los registros no deben eliminarse físicamente.

Utilizar Soft Delete mediante un campo como:

```
deletedAt DateTime?
```

Los registros eliminados no deben aparecer en consultas normales.

---

# Git

Nunca trabajar directamente sobre:

```
main
```

Las funcionalidades deben desarrollarse mediante ramas.

Ejemplos:

```
feat/login

feat/register

feat/users

feat/games

feat/auth

fix/login

refactor/models
```

Los commits deben ser pequeños y descriptivos.

---

# Trabajo colaborativo

Evitar modificar simultáneamente los mismos archivos.

Siempre que sea posible dividir el trabajo por módulos.

Ejemplo:

Desarrollador A

- Usuarios
- Autenticación

Desarrollador B

- Juegos
- Base de datos

---

# Prisma

Evitar conflictos en:

```
schema.prisma
```

Las modificaciones estructurales de la base de datos deben coordinarse entre ambos desarrolladores antes de generar nuevas migraciones.

---

# Estilo de desarrollo

Priorizar:

- código simple
- código legible
- mantenibilidad
- tipado fuerte
- separación de responsabilidades

Evitar soluciones excesivamente complejas cuando exista una alternativa más sencilla.

---

# Qué deben hacer los agentes

Siempre que generen código deben:

- respetar la arquitectura MVC
- utilizar TypeScript moderno
- utilizar async/await
- utilizar Prisma
- validar entradas con Zod
- utilizar bcrypt para contraseñas
- seguir la estructura de carpetas del proyecto
- mantener consistencia con el resto del código
- reutilizar código antes de duplicarlo
- escribir código limpio y fácil de mantener

---

# Qué NO deben hacer

No deben:

- usar `any` innecesariamente
- escribir consultas SQL manuales
- acceder a Prisma desde las rutas
- colocar lógica de negocio en las vistas
- duplicar lógica entre controladores
- eliminar registros físicamente (hard delete)
- generar código que rompa la arquitectura MVC

---

# Objetivo final

Construir una aplicación consistente, mantenible y fácil de extender, siguiendo buenas prácticas de desarrollo web moderno con Express, TypeScript y Prisma.

## Definition of Done

Una funcionalidad se considera terminada cuando:

- [ ] La entrada está validada mediante Zod.
- [ ] Existe tipado TypeScript adecuado.
- [ ] La lógica de negocio está fuera de las rutas.
- [ ] El acceso a Prisma está encapsulado en models.
- [ ] Las rutas están protegidas cuando corresponde.
- [ ] Se respetan los roles de usuario.
- [ ] Se implementa soft delete cuando corresponde.
- [ ] La funcionalidad funciona en móvil y escritorio.
- [ ] No existen errores de TypeScript.
- [ ] ESLint no reporta errores.
- [ ] Se agregaron tests cuando existe lógica de negocio relevante.
- [ ] El cambio está en una rama específica.
- [ ] El commit describe claramente el cambio.
