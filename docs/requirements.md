# Requerimientos funcionales

El siguiente documento detalla los requerimientos funcionales y casos de uso dentro del alcanze del proyecto.

## Requisitos de cátedra

Integrantes: 3

Alcance: Aprobación directa

- 3 CRUDs simples (1 por cada integrante).
- 2 CRUDs dependientes (1 por cada dos integrantes o fracción).
- 2 listados con filtros y detalles de elementos (1 por cada dos integrantes o fracción).
- 3 casos de uso con valor para el negocio (1 por cada integrante).

## CRUDs simples

### Restricciones alimentarias

Administrar restricciones alimentarias mediante un nombre y una descripción, para identificar las necesidades de los comensales y las características de las opciones de comida.

### Oficinas

Administrar las sedes de la organización con su nombre, dirección, ciudad y país, para identificar dónde trabajan los comensales y se distribuyen las comidas. Incluye visualización geográfica del lugar en un mapa.

### Departamentos/equipos

Administrar los departamentos o equipos mediante un nombre y una descripción, para identificar el grupo de trabajo de cada comensal.

## CRUDs dependientes

### Comensales

Administrar el perfil de cada comensal asociado a una cuenta de usuario, una oficina y un departamento, con su nombre y sus restricciones alimentarias opcionales. Depende de restricciones alimenticias, que identifica las necesidades de los comensales.

### Menúes

Administrar menúes con fecha de comida, título, descripción, plazo para realizar pedidos y opciones de comida con restricciones alimentarias opcionales. Depende de usuarios, se le asigna un responsable encargado de llevarlo a cabo.

## Listados

### Menúes semanales

Listar los menúes de la semana seleccionada y permitir filtrar por fecha. Mostrar en el detalle el plazo para pedir y encargado.

## Casos de uso

### Ordenar comida en un menú

Permitir que un comensal elija una opción de un menú vigente, agregue un comentario y confirme su pedido. Permitir modificarlo o cancelarlo antes del vencimiento y evitar pedidos duplicados para el mismo comensal y menú.

### Controlar entrega

Permitir que la persona responsable consulte los pedidos de un menú y registre la entrega de cada comida, distinguiendo entre pedidos pendientes, faltantes o sobrantes, y poder ubicarlos en las distintas oficinas.

### Notificar creación y vencimiento de menúes

Notificar a los comensales cuando se publique un menú y enviar un recordatorio antes del cierre de pedidos, indicando la fecha de comida, el plazo y el acceso al menú. Esta comunicación se puede hacer por integraciones con canales externos, como Slack o Discord, por ejemplo.

## No funcionales

### Configuración inicial de plataforma

Detectar el primer inicio con la base de datos vacía y ofrecer un asistente para crear el primer usuario con permisos de administración y configurar el idioma de la plataforma. Sugerir pasos opcionales, como cargar las primeras restricciones alimentarias y configurar integraciones para notificaciones, permitiendo omitirlos y completarlos más adelante.

### Autenticación y manejo de sesiones

Permitir iniciar y cerrar sesión mediante correo electrónico y contraseña, proteger las contraseñas mediante hash y limitar la vigencia de las sesiones. Validar la sesión y el estado de la cuenta en cada solicitud protegida, rechazando accesos con credenciales inválidas, sesiones vencidas o cuentas deshabilitadas.

### Gestión de usuarios

Permitir crear cuentas de usuario, consultar y actualizar sus datos, habilitarlas o deshabilitarlas y restablecer sus contraseñas.

### Gestión de permisos

Permitir asignar y revocar permisos de manera granular para administrar usuarios, crear o modificar menúes propios o ajenos y realizar pedidos en nombre de otros comensales o invitados. Verificar las autorizaciones al ejecutar cada operación.

### Documentación por OpenAPI

Documentar la API mediante la especificación OpenAPI, detallando las operaciones disponibles, sus parámetros, los formatos de solicitud y respuesta, los requisitos de autenticación y los posibles errores. Ofrecer una interfaz interactiva para consultar la documentación y probar las operaciones, disponible a administradores avanzados.
