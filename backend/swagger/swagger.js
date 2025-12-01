// swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      customCssUrl: '/css/custom-swagger.css',
      title: 'API Buggle',
      description: 'API Documentation with JWT Authentication + Cookies',
      version: '1.0.0',
      contact: {
        name: 'Buggle',
        email: 'rootbuggle@gmail.com'
      }
    },
    servers: [
      {
        url: "https://backend-llwm.onrender.com/api",
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID único del usuario' },
            fullName: { type: 'string', description: 'Nombre completo del usuario' },
            username: { type: 'string', description: 'Nombre de usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            role: { type: 'string', enum: ['superadmin', 'admin', 'user'], description: 'Rol del usuario' },
            roleId: { type: 'string', description: 'ID del rol asignado' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID único del rol' },
            name: { type: 'string', description: 'Nombre del rol' },
            permission: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de permisos'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Log: {
          type: 'object',
          required: ['issue_id', 'message', 'created_at', 'active', 'userId'],
          properties: {
            issue_id: {
              type: 'string',
              description: 'ID único del incidente'
            },
            message: {
              type: 'string',
              description: 'Mensaje del error'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada'
            },
            culprit: {
              type: 'string',
              description: 'Causa principal del error'
            },
            error_type: {
              type: 'string',
              enum: ['error', 'warning', 'info'],
              description: 'Tipo de error'
            },
            environment: {
              type: 'string',
              enum: ['testing', 'development', 'production'],
              description: 'Entorno de ejecución'
            },
            status: {
              type: 'string',
              enum: ['unresolved', 'in review', 'solved'],
              description: 'Estado del log'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada'
            },
            priority: {
              type: 'string',
              description: 'Nivel de prioridad del log'
            },
            assigned_to: {
              type: 'string',
              description: 'Usuario asignado para resolver el log'
            },
            count: {
              type: 'string',
              description: 'Número de veces que ha ocurrido este incidente'
            },
            active: {
              type: 'string',
              description: 'Indica si el log está activo'
            },
            error_signature: {
              type: 'string',
              description: 'Tipo error desde metadata de Sentry'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Mensaje de error' },
            error: { type: 'string', description: 'Detalle del error' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Roles', description: 'Role management' },
      { name: 'Logs', description: 'Log management' },
      { name: 'General', description: 'General Endpoints' }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './docs/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    //customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl: '/css/custom-swagger.css',
    customSiteTitle: 'API Buggle - Documentation',
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📘 Swagger documentation available at: http://localhost:3000/api-docs');
  console.log('📋 JSON Schema available in: http://localhost:3000/api-docs.json');
}

module.exports = swaggerDocs;
