const validarEmail = (request, response, next) => {
  const { email } = request.body;
  const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email || email === '') {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!email.match(mailformat)) {
    return response.status(400).json({ message: 'O "email" deve ter o formato "email@email.com' });
  }

  next();
};

module.exports = validarEmail;