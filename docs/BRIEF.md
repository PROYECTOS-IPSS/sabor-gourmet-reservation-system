# Brief — Sabor Gourmet

## Objetivo

Crear una aplicación web para reservar mesas del restaurante Sabor Gourmet con autenticación de clientes y un panel administrativo.

Este documento define únicamente el MVP.

## Usuarios

### Visitante

Sin necesidad de cuenta, puede:

- consultar disponibilidad de mesas por fecha, horario y cantidad de personas.

Para reservar, modificar o cancelar debe registrarse e iniciar sesión.

### Cliente

Se registra, inicia sesión y puede:

- crear reservas;
- consultar sus reservas;
- modificar sus propias reservas;
- cancelar sus propias reservas.

Los datos de contacto (nombre y email) se toman de su perfil de usuario.

### Administrador

Inicia sesión y puede:

- listar, crear, editar y cancelar cualquier reserva;
- crear y editar mesas;
- configurar la capacidad de las mesas;
- activar o desactivar mesas;
- ver las reservas actuales del restaurante.

## Flujo de reserva

1. El visitante elige fecha, horario y cantidad de personas.
2. El sistema consulta y muestra si existe disponibilidad.
3. Para confirmar, el sistema solicita registro o inicio de sesión.
4. El cliente autenticado confirma la reserva.
5. El servidor asigna automáticamente la mesa activa más adecuada según capacidad y disponibilidad.
6. Se muestra un código único de confirmación y la mesa asignada.

## Reglas de disponibilidad

- Días: miércoles a domingo.
- Horario: 18:00 a 23:00.
- Duración fija: 90 minutos.
- Horarios de inicio cada 30 minutos.
- Último inicio válido: 21:30.
- Mínimo: 1 persona.
- Máximo: capacidad de la mesa asignada.
- No se aceptan fechas u horarios pasados.
- No se aceptan reservas superpuestas en una misma mesa.
- La disponibilidad se valida en el servidor al guardar y al modificar.

Las reservas de clientes y las creadas por el administrador usan las mismas reglas.

## Reserva

Una reserva pertenece a un cliente autenticado y a una mesa. Sus datos son:

- código único de confirmación;
- cliente (referencia al `User` autenticado);
- mesa asignada;
- fecha;
- hora de inicio y fin;
- cantidad de personas;
- estado: `CONFIRMED`, `COMPLETED` o `CANCELLED`;
- fechas de creación y actualización.

Los datos de contacto (nombre, email) se obtienen del perfil del usuario. No se duplican en la reserva.

## Modificación y cancelación

- El cliente solo puede modificar o cancelar sus propias reservas.
- El administrador puede modificar o cancelar cualquier reserva.
- Modificar una reserva vuelve a ejecutar todas las reglas de disponibilidad.
- Cancelar cambia el estado a `CANCELLED`; no se elimina físicamente el registro.
- No se permite modificar ni cancelar reservas pasadas.

## Datos mínimos

### User

- nombre;
- email único;
- hash de contraseña;
- rol: `CUSTOMER` o `ADMIN`;
- fechas de creación y actualización.

### Table

- número único;
- capacidad;
- activa o inactiva;
- fechas de creación y actualización.

### Reservation

- código único de confirmación;
- cliente (`userId`);
- mesa (`tableId`);
- fecha;
- hora de inicio y fin;
- cantidad de personas;
- estado;
- fechas de creación y actualización.

## Criterios de aceptación

- Cualquier persona puede consultar disponibilidad sin registrarse.
- Un visitante puede registrarse, iniciar sesión y crear una reserva.
- El sistema asigna una mesa compatible y activa automáticamente; el cliente no elige mesa.
- Se rechazan datos inválidos, horarios fuera de atención, fechas pasadas y falta de disponibilidad.
- No se pueden confirmar reservas superpuestas.
- Un cliente solo puede modificar o cancelar sus propias reservas.
- Un cliente no puede acceder ni modificar reservas de otros clientes.
- El administrador puede crear, listar, editar y cancelar cualquier reserva.
- El administrador puede crear, editar, activar, desactivar y configurar la capacidad de las mesas.
- Cancelar cambia el estado de la reserva; no la borra físicamente.
- La confirmación de reserva muestra un código único.
- La interfaz funciona en móvil y escritorio.

## Fuera del MVP

- Reservas sin cuenta de cliente.
- Modificación o cancelación sin autenticación.
- Emails, SMS y recordatorios.
- Pagos.
- Pedidos, delivery y menú.
- Plano visual del salón.
- Reportes y estadísticas.
