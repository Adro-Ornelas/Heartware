const errorHandler = (err, req, res, next) => {
  console.error('Error en la API:', err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: 'Error interno del servidor',
  });
};

module.exports = {
  errorHandler,
};
