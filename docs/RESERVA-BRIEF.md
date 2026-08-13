# RESERVA SCREEN

sin login:

- Debe aparecer campo "Mesa" en el formulario, el cual debe ser seleccionado en la card Mesas Disponibles.
- Al presionar "Ver diponibilidad" se envía un json con los datos de la request, tanto hora, fecha, y solapamiento (hay que tener en cuenta que cada reserva dura hora y media).
- El texto de "Mesa x disponible para x personas" debe aparecer en una card.

con login:

- Debe aparecer campos "Mesa" en el formulario, el cual debe ser seleccionado en la card Mesas Disponibles
- Si está disponible, debe salir un botón para enviar la request con la reserva, se debe guardar la reserva en la base de datos
- El header debe agregar la screen "Mis reservas", con la información de las reservas del usuario
- Las reservas deben estar divididas en el siguiente orden: Confirmadas -> Completadas -> Canceladas
- Dentro de las cards de cada reserva debe existir un botón "Cancelar reserva" que abre un modal advirtiendo que la acción no se puede deshacer.
- Dentro de las cards de cada reserva debe existir un botón "Modificar reserva" que abre un modal que permite cambiar la reserva de fecha, hora y mesa, también debe tener un boton para ver disponibilidad, y si está disponible, ahí recién se permite cambiar la reserva.
