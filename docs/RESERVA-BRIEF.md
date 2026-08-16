# RESERVA SCREEN

## Visitante

- Debe aparecer formulario con fecha, horario y cantidad de personas.
- "Ver disponibilidad" consulta el servidor.
- El servidor asigna automáticamente la mesa activa más adecuada.
- La respuesta muestra mesa asignada y capacidad.

## Cliente autenticado

- Usa fecha, horario y cantidad de personas; no elige mesa.
- Puede confirmar reserva cuando existe disponibilidad.
- La reserva guarda mesa asignada por servidor.
- Header incluye "Mis reservas".
- Orden: Confirmadas -> Completadas -> Canceladas.
- Reserva confirmada permite cancelación mediante modal.
- Modificación permite fecha, hora y cantidad de personas.
- Al modificar, servidor valida reglas y reasigna mesa automáticamente.
