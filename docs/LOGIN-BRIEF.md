# LOGIN Y REGISTRO

- La API expone `/api/health` y verifica conexión con PostgreSQL.
- El registro público siempre crea usuarios `CUSTOMER`.
- Nunca se acepta el rol desde el formulario público.
- Admin y employee se crean mediante seed o administración controlada, no desde registro público.
- Nombre, apellido y correo del usuario autenticado se muestran desde su perfil.
- Zod valida login y registro.
- Tras registrarse, la sesión persiste y la pantalla redirige a `/reservar`.
- La sesión usa cookie HTTP-only.
- Con sesión activa desaparecen "Registrarse" e "Iniciar sesión" y aparece "Cerrar sesión".
