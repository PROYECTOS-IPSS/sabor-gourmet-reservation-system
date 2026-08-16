# Informe Técnico Final: Sabor Gourmet

## 1. Introducción

Sabor Gourmet es una aplicación web para digitalizar las reservas de mesas de un restaurante. El sistema reemplaza el proceso manual por un flujo centralizado que permite consultar disponibilidad, registrar clientes, crear reservas, modificar reservas propias, cancelar reservas y administrar mesas desde un panel protegido.

El alcance corresponde al MVP definido en `docs/BRIEF.md`. La asignación de mesa es responsabilidad del servidor: el cliente indica fecha, horario y cantidad de personas, y el sistema busca una mesa activa con capacidad suficiente y sin reservas confirmadas superpuestas.

## 2. Objetivos funcionales

### Visitante

- Consultar disponibilidad sin iniciar sesión.
- Indicar fecha, horario y cantidad de personas.
- Ver la mesa que el servidor asignaría.
- Registrarse o iniciar sesión para confirmar.

### Cliente

- Registrarse como `CUSTOMER`.
- Iniciar y cerrar sesión.
- Crear reservas.
- Consultar sus reservas.
- Modificar únicamente sus propias reservas.
- Cancelar únicamente sus propias reservas.
- Ver el código de confirmación y el estado de cada reserva.

### Employee

- Iniciar sesión.
- Acceder al dashboard.
- Consultar mesas, clientes y reservas.
- No crear, editar ni cancelar información administrativa.

### Administrador

- Consultar mesas, clientes y reservas.
- Crear y editar mesas.
- Configurar capacidad.
- Activar y desactivar mesas.
- Crear, editar y cancelar cualquier reserva.

## 3. Reglas de negocio

Las reglas se validan en el servidor, no solo en React:

- Días válidos: miércoles a domingo.
- Horario de atención: 18:00 a 23:00.
- Inicio de reserva cada 30 minutos.
- Último inicio: 21:30.
- Duración fija: 90 minutos.
- Mínimo: 1 persona.
- La mesa se asigna automáticamente.
- La mesa debe estar activa.
- La mesa debe tener capacidad suficiente.
- No se permiten reservas confirmadas superpuestas.
- No se permiten fechas u horarios pasados.
- Las reglas se vuelven a ejecutar al modificar una reserva.
- Cancelar cambia el estado y conserva el registro.

## 4. Arquitectura MVC

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

### Routes

Ubicación: `src/routes/`

Definen los endpoints y conectan validaciones, sesiones, autorización y controladores. No contienen consultas Prisma ni reglas de negocio.

### Controllers

Ubicación: `src/controllers/`

Reciben `Request`, utilizan datos previamente validados, llaman a los servicios y devuelven respuestas JSON con códigos HTTP apropiados.

### Services

Ubicación: `src/services/`

Contienen las reglas de disponibilidad, asignación, autenticación, creación, modificación y cancelación de reservas. La validación de disponibilidad no depende de React.

### Models

Ubicación: `src/models/`

Encapsulan el acceso a PostgreSQL mediante Prisma. El modelo de reservas incluye variantes que permiten trabajar con clientes transaccionales durante operaciones administrativas.

### Schemas

Ubicación: `src/schemas/`

Zod valida `body`, `params` y `query`. Entre los contratos principales están login, registro, mesas, reservas administrativas y parámetros de reserva.

### Middleware

Ubicación: `src/middleware/`

- `validate.middleware.ts`: validación Zod.
- `auth.middleware.ts`: sesión y roles.
- `error.middleware.ts`: respuesta controlada ante errores.

> **[NOTA DE IMAGEN 1]** Capturar el diagrama MVC y la estructura de carpetas.

## 5. Persistencia y modelo de datos

La base usa PostgreSQL con Prisma ORM.

### User

- `name`.
- `apellido`.
- `email` único.
- `passwordHash`.
- `role`.

- Fechas de creación y actualización.

### Table

- `number` único.
- `capacity`.
- `isActive`.
- Fechas de creación y actualización.

### Reservation

- `confirmationCode` único.
- `userId`.
- `tableId`.
- `date`.
- `startTime`.
- `endTime`.
- `guests`.
- `status`.
- Fechas de creación y actualización.

Las relaciones principales son:

```text
User 1 ──── N Reservation N ──── 1 Table
```

> **[NOTA DE IMAGEN 2]** Capturar `prisma/schema.prisma` mostrando User, Table y Reservation.

## 6. Asignación automática y disponibilidad

El cliente no decide la mesa definitiva. El flujo es:

1. Frontend envía fecha, hora y personas.
2. Middleware valida el payload con Zod.
3. Service calcula ventana de 90 minutos.
4. Model busca una mesa activa con capacidad suficiente.
5. Model excluye reservas confirmadas solapadas.
6. Service devuelve mesa asignada o indisponibilidad.
7. Al guardar, la misma regla se ejecuta nuevamente.

La validación al guardar evita confiar en una disponibilidad calculada previamente en el navegador.

> **[NOTA DE IMAGEN 3]** Capturar `src/services/reservation.service.ts` y `src/models/reservation.model.ts` mostrando la asignación automática.

## 7. Seguridad y autorización

### Contraseñas

Las contraseñas nunca se guardan en texto plano. `bcryptjs` genera un hash con 12 rondas.

### Sesiones

`express-session` utiliza cookies `HTTP-only` y `sameSite: 'lax'`. El navegador no puede leer directamente la cookie desde JavaScript.

### Roles

- `CUSTOMER`: reservas propias.
- `EMPLOYEE`: lectura administrativa.
- `ADMIN`: operaciones administrativas completas.

La autorización se ejecuta en backend. Ocultar botones en React no reemplaza los middlewares de seguridad.

### Validación

Todo dato externo debe pasar por Zod antes de llegar a la lógica de negocio. Los IDs de reservas administrativas y de clientes también tienen schemas específicos.

> **[NOTA DE IMAGEN 4]** Capturar `src/middleware/auth.middleware.ts` mostrando `requireRoles`.
>
> **[NOTA DE IMAGEN 5]** Capturar `src/app.ts` mostrando `express-session`.
>
> **[NOTA DE IMAGEN 6]** Capturar `src/routes/admin.routes.ts` mostrando permisos separados para lectura y escritura.

## 8. SOLID y calidad del código

### Single Responsibility

- Routes definen endpoints.
- Controllers gestionan HTTP.
- Services aplican reglas.
- Models consultan la base.
- Schemas validan entradas.
- Middleware controla acceso y errores.

Los formularios y vistas manejan interacción y estado visual; no deciden disponibilidad definitiva.

`DashboardPage.tsx` actúa como orquestador de estado para la vista administrativa. Es el componente más grande del frontend porque coordina mesas, reservas, permisos y mensajes; sus operaciones de negocio permanecen delegadas a services. Separarlo en paneles hijos reduciría su tamaño, pero no cambia la responsabilidad del backend ni la seguridad del flujo.

### Open/Closed

La selección de reglas se mantiene en services y schemas. Agregar una regla de disponibilidad no requiere duplicarla en cada vista.

### Liskov

No se usa herencia de dominio. La implementación usa composición de funciones y componentes React.

### Interface Segregation

Los tipos de entradas se separan por contexto: autenticación, reservas de cliente, reservas administrativas y mesas.

### Dependency Inversion

Las operaciones de negocio llaman modelos, no consultas SQL directas. Las transacciones administrativas reciben el cliente transaccional a través de funciones de modelo.

### Código autoexplicativo

Se priorizan nombres descriptivos, funciones pequeñas y comentarios solo cuando explican una decisión o restricción real. No se agregan comentarios que repitan el código.

## 9. Frontend y responsive design

El frontend usa React, TypeScript, Vite y TailwindCSS.

- Diseño mobile-first.
- Tipografías Playfair Display, Space Grotesk y DM Mono.
- Paleta oscura con acentos dorados y bronce.
- Foco visible para teclado.
- Mensajes de carga, error, éxito y vacío.
- Vista de mesas sin selección manual.
- Asignación automática informada al usuario.
- Rutas `/carta` y `/experiencia` funcionales.
- Vista `Mis reservas` con fechas UTC para evitar desplazamientos de día.

> **[NOTA DE IMAGEN 7]** Capturar la pantalla pública de reserva en escritorio.
>
> **[NOTA DE IMAGEN 8]** Capturar la misma pantalla en móvil.
>
> **[NOTA DE IMAGEN 9]** Capturar `Mis reservas` con estados y acciones.
>
> **[NOTA DE IMAGEN 10]** Capturar dashboard ADMIN y dashboard EMPLOYEE para evidenciar permisos distintos.

## 10. Health check y base de datos

`GET /api/health` ejecuta una consulta `SELECT 1` mediante Prisma. Si PostgreSQL no responde, el error pasa al middleware global y la API no informa falsamente que la base está saludable.

> **[NOTA DE IMAGEN 11]** Capturar respuesta de `/api/health` con `database: "ok"`.

## 11. Datos demo

El seed actual genera:

- 1 `ADMIN`.
- 1 `EMPLOYEE`.
- 4 `CUSTOMER`.
- 12 mesas.
- 20 reservas demo.

Las reservas demo respetan capacidad de mesa y usan `upsert` para evitar duplicados al ejecutar el seed nuevamente.

> **[NOTA DE IMAGEN 12]** Capturar Prisma Studio con User, Table y Reservation.

## 12. Instalación y ejecución

### Variables de entorno

Crear `.env` desde `.env.example`:

```bash
copy .env.example .env
```

Configurar `DATABASE_URL` y `SESSION_SECRET`. `.env` no se versiona.

### PostgreSQL

```bash
docker compose up -d
```

### Backend

```bash
yarn install
yarn db:generate
yarn db:migrate
yarn db:seed
yarn dev
```

API: `http://localhost:3000`

### Frontend

En otra terminal:

```bash
cd frontend
yarn install
yarn dev
```

Vite mostrará la URL disponible, normalmente `http://localhost:5173`.

## 13. Verificación ejecutada

Backend:

```bash
yarn typecheck
yarn lint
yarn test
yarn build
```

Frontend:

```bash
yarn typecheck
yarn build
```

Resultado actual:

- Backend typecheck: aprobado.
- Backend lint: aprobado.
- Tests: 3 archivos y 11 pruebas aprobadas.
- Frontend typecheck: aprobado.
- Frontend build: aprobado.
- Health check PostgreSQL: aprobado.
- Edición de reserva con mesa automática: aprobada mediante API.

## 14. Conclusión

El proyecto implementa el MVP solicitado con separación MVC, validación de entradas, control de roles, sesiones seguras, asignación automática de mesas y persistencia PostgreSQL mediante Prisma.

La documentación fue alineada para que la regla oficial sea clara: el cliente informa fecha, hora y personas; el servidor asigna la mesa.
