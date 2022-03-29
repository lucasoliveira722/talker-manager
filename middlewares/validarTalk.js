const validarTalkWatched = (request, response, next) => {
  const { talk: { watchedAt } } = request.body;
  // Validação de Regex de data encontrada em: https://hkotsubo.github.io/blog/2019-04-05/posso-usar-regex-para-validar-datas#:~:text=A%20primeira%20regex%20verifica%20datas,1%2F1%2F2019%20).
  const dateFormat = /\d{2}\/\d{2}\/\d{4}/;

  if (!watchedAt.match(dateFormat)) {
    return response.status(400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
}
  next();
};

const validarTalkRate = (request, response, next) => {
  const { talk: { rate } } = request.body;

  if (rate < 1 || rate > 5) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const validarTalk = (request, response, next) => {
  const { talk } = request.body;

  if (!talk || !talk.watchedAt || (!talk.rate && talk.rate !== 0)) {
    return response.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }

  next();
};

module.exports = {
  validarTalkWatched,
  validarTalkRate,
  validarTalk,
};