const validarEmail = require('./validarEmail');
const validarSenha = require('./validarSenha');
const validarNome = require('./validarNome');
const validarIdade = require('./validarIdade');
const validarToken = require('./validarToken');
const {
  validarTalkWatched,
  validarTalkRate,
  validarTalk,
} = require('./validarTalk');

module.exports = {
  validarEmail,
  validarSenha,
  validarNome,
  validarIdade,
  validarTalkWatched,
  validarTalkRate,
  validarTalk,
  validarToken,
};
