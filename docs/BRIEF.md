# Brief — Sabor Gourmet

## Objetivo

Crear una aplicación web sencilla para reservar mesas del restaurante y permitir que un administrador gestione reservas y mesas.

Este documento define únicamente el MVP.

## Usuarios

### Cliente público

No necesita registrarse, iniciar sesión ni tener un `userId`. Puede:

- consultar disponibilidad;
- indicar sus datos y cantidad de personas;
- crear una reserva;
- ver una confirmación con código.

En el MVP no puede editar ni cancelar reservas.

La reserva guarda los datos de contacto directamente. No se crea un usuario falso para representar al cliente.

### Administrador

Inicia sesión y puede:

- listar, crear, editar y cancelar reservas;
- crear y editar mesas;
- activar o desactivar mesas.

Solo el administrador necesita una cuenta.

## Reserva pública

El flujo es:

1. Elegir fecha.
2. Elegir un horario disponible.
3. Indicar cantidad de personas.
4. Indicar nombre, apellido y email.
5. Confirmar la reserva.
6. Mostrar código de confirmación.

El cliente no elige mesa. El sistema asigna automáticamente una mesa activa con capacidad suficiente.

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
- La disponibilidad se valida nuevamente en el servidor al guardar.

Las reservas públicas y las creadas por el administrador usan las mismas reglas.

## Datos mínimos

### Reservation

- código único;
- nombre, apellido y email del cliente;
- fecha;
- hora de inicio y fin;
- cantidad de personas;
- mesa asignada;
- estado: `CONFIRMED` o `CANCELLED`;
- fechas de creación y actualización.

Una `Reservation` pública no tiene `userId` ni relación obligatoria con `User`. El contacto se guarda en la propia reserva.

### Table

- número único;
- capacidad;
- activa o inactiva;
- fechas de creación y actualización.

### Admin User

- email;
- hash de contraseña;
- rol administrador.

`User` se utiliza únicamente para el administrador en este MVP. El administrador inicial se crea con el seed de Prisma. No existen cuentas de clientes.

## Criterios de aceptación

- Se puede reservar sin registrarse.
- El sistema asigna una mesa compatible y activa.
- Se rechazan datos inválidos, horarios fuera de atención, fechas pasadas y falta de disponibilidad.
- No se pueden confirmar reservas superpuestas.
- El administrador puede iniciar sesión.
- El administrador puede crear, listar, editar y cancelar reservas.
- El administrador puede crear, editar, activar y desactivar mesas.
- Cancelar cambia el estado; no borra físicamente la reserva.
- La confirmación muestra un código único.
- La interfaz funciona en móvil y escritorio.

## Fuera del MVP

- Cuentas de clientes.
- Edición o cancelación por clientes.
- Emails, SMS y recordatorios.
- Pagos.
- Pedidos, delivery y menú.
- Plano visual del salón.
- Reportes y estadísticas.
