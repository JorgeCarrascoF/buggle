const Boom = require('@hapi/boom');

const errorHandler = (err, req, res, next) => {
  if (Boom.isBoom(err)) {
    const { statusCode, payload } = err.output;
    return res.status(statusCode).json({
      statusCode,
      error: payload.error,
      message: payload.message || err.message,
      details: err.data?.details
    });
  }

  // Manejo de errores de MongoDB (ej: duplicados, validaciones, etc.)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      statusCode: 400,
      error: 'Validation Error',
      message: err.message,
      details: Object.values(err.errors).map(e => e.message) // Detalles de validación de Mongoose
    });
  }

  // Manejo de errores de duplicados en MongoDB (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      statusCode: 409,
      error: 'Conflict',
      message: `${field} already exists.`,
      details: err.keyValue
    });
  }

  // Manejo de errores de CastError (ej: ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      //message: `Invalid format for ${err.path}`
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Errores genéricos (500)
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Unexpected error'
  });
};

module.exports = errorHandler;
