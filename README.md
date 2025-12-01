# Buggle

**Descripción:**  
Buggle es un sistema integral de gestión de logs diseñado para facilitar la trazabilidad, diagnóstico y resolución de fallos en entornos de desarrollo y producción. Su núcleo es un dashboard adaptado a diferentes roles (Desarrolladores, Administradores) que permite visualizar y gestionar errores tanto automáticos como manuales, con acceso controlado según permisos. Además, ofrece funcionalidades clave como filtrado avanzado, historial detallado, asignación y seguimiento de incidencias. El MVP se enfoca en proporcionar una plataforma colaborativa, segura y eficiente que mejora la comunicación y la respuesta ante fallos, sentando las bases para futuras mejoras basadas en IA y personalización avanzada.

---

## Tecnologías utilizadas

- **Frontend:**

  - `React` para construir la interfaz de usuario.
  - `React Query` para el manejo de datos asíncronos.
  - `Tailwind CSS` para los estilos.
  - `ESLint` para el análisis de código estático y la detección de problemas.
  - `Axios` para las llamadas HTTP.
  - `JWT Decode` para manipulación y decodificación de tokens JWT.
  - `Sentry` para captura automática de errores (y como base de captura de logs para este proyecto)
  - `React Spinners` para mostrar indicadores de carga.

- **Backend:**

  - `Express` para construir la API RESTful.
  - `Nodemon` para reiniciar automáticamente el servidor durante el desarrollo.
  - `Mongoose` para modelar y gestionar datos en MongoDB.
  - `Express-validator` para la validación de datos en las solicitudes.
  - `Bcrypt` para el hash de contraseñas.
  - `Jsonwebtoken` para la gestión de tokens JWT.
  - `Cookie-parser` para el manejo de cookies.
  - `CORS` para permitir solicitudes de diferentes orígenes.
  - `Boom` para el manejo de errores HTTP.
  - `Swagger` para la documentación de la API.

- **Base de Datos:**
  - `MongoDB` como base de datos NoSQL.

---

## Instrucciones para correr localmente

1. Clonar el repositorio madre:

   ```bash
   git clone --recurse-submodules https://github.com/JorgeCarrascoF/buggle
   ```

    Para instalar este proyecto, debe añadirse la opción --recurse-submodules al hacer git clone para añadir los submódulos. En caso de haber clonado sin esa opción, podemos inicializar los submódulos manualmente con:

        cd buggle
        git submodule update --init --recursive

2. Instalar dependencias:   

   ```bash
   cd frontend
   npm install
   ```

   ```bash
   cd backend
   npm install
   ```

3. Arrancar las aplicaciones:

   ```bash
   cd frontend
   npm run dev
   ```

   ```bash
   cd backend
   npm run dev
   ```

    El frontend se puede visualizar en http://localhost:5173

    El backend corre en http://localhost:3000


## Estructura de carpetas
```
📦buggle/
├── 📁frontend/
│   ├── 📁public/               # Archivos estáticos (imágenes, favicon, etc)
│   ├── 📁src/                  # Código fuente React
│   │   ├── 📁assets/           # Imágenes, fuentes, estilos globales
│   │   ├── 📁components/       # Componentes React reutilizables
│   │   ├── 📁context/          # Contextos de React utilizados
│   │   ├── 📁queries/          # Lógica para llamadas API (axios, react-query)
│   │   ├── 📁routes/           # Páginas o vistas principales
│   │   ├── 📁utils/            # Funciones utilitarias
│   │   ├── api.js            # Instancia de Axios y configuración
│   │   ├── App.css           # Estilos globales
│   │   ├── App.jsx           # Componente raíz
│   │   ├── index.css         # Estilos específicos de la página de inicio
│   │   └── main.jsx          # Punto de entrada de la aplicación
│   ├── .env                  # Variables de entorno frontend
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
├── 📁backend/
│   ├── 📁bin/                  # Scripts de inicio del servidor
│   ├── 📁connections/          # Conexiones a la base de datos
│   ├── 📁controllers/          # Controladores para las rutas
│   ├── 📁docs/                 # Documentación de la API
│   ├── 📁middlewares/          # Middlewares de Express
│   ├── 📁models/               # Modelos de Mongoose (DB)
│   ├── 📁public/               # Archivos como la hoja de estilos
│   ├── 📁routes/               # Rutas de Express
│   ├── 📁services/             # Lógica de negocio y acceso a datos
│   ├── 📁swagger/              # Documentación de la API con Swagger
│   ├── 📁validations/          # Schemas de validación (Joi, express-validator)
│   ├── 📁views/                # Vistas preliminares realizadas en Pug
│   ├── .gitignore            # Archivos y carpetas a ignorar en Git
│   ├── app.js                # Archivo principal de la aplicación
│   ├── package-lock.json
│   ├── package.json   
│   ├── server.js             
│   ├── testGeneral.js         
│   └── testUser.js
├── .gitsubmodules 
└── README.md
```

## Organización de ramas

Frontend y Backend se organizan en dos ramas principales: main y develop (dev en el caso de backend). Al crear una nueva feature, debe crearse una nueva rama a partir de develop, con el nombre feature/nombre-de-la-feature.
Se requiere una PR aprobada por otro colaborador para poder subir los cambios a main.

## Organización de commits 

Estructura básica de un commit: <tipo> [ámbito opcional]: <descripción breve>
Los tipos incluyen `feat` (para nuevas funcionalidades), `fix` (para correcciones) , `docs` (para cambios en la documentación) o `BREAKING CHANGE` si es un cambio que rompe compatibilidad.

Ejemplos:
- feat(auth): añade soporte para login con Google
- fix(api): corrige error en parseo de fechas
- docs(readme): añade sección de instalación
- BREAKING CHANGE(api): cambia formato de respuesta de /users, ahora la respuesta devuelve un objeto en lugar de un array
