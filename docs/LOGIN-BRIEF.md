# NOTAS

cambia el branch a feat/flujo-reserva

añade una verificación del estado de la base de datos, para ver si está recibiendo conexiones

# Reservar Screen

Los campos nombre, apellido y correo deben estar ocultos.
Usa zod para verificar que los campos se cumplan de forma correcta.
Al presionar ver disponibilidad, se revisa en la base de datos la disponibilidad de la mesa.
Si no existe, crea un servicio que verifique la disponibilidad de las mesas y crea un modelo que reciba la información de las reservas. en el controller se verifica la disponibilidad de una mesa.
El json que envíe /reservar debe verificar la disponibilidad de la mesa, y el no solapamiento de esta, quita la sección de "Fechas disponibles" en la card expandida de las mesas

# Registro

Modifica createCustomerUser para que también pueda crear nuevos administradores y empleados, por lo que debe recibir userType (o lo que estimes conveniente) como parámetro, en base a ello, fíjate en el controller lo que envía a user.model.ts.

La pantalla de registro principal (sin sesión iniciada) debe crear un usuario CUSTOMER por defecto.

Luego de registrarse, la pantalla debe dirigirse a /reservar. en el formulario debe aparecer los campos nombre, apellido y correo rellenados por defecto con la información del usuario.

La sesión tiene que persistir entre pantallas

Los botones Registrarse e Iniciar Sesión deben desaparecer del header, en su lugar debe aparecer un botón para cerrar sesión, que elimina la sesión activa del usuario.

Si tienes preguntas hazlas antes de realizar algún cambio mayor
