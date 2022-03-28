const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const {
  validarEmail,
  validarSenha,
  validarNome,
  validarIdade,
} = require('./middlewares/index.js');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const validarToken = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== 16) {
    return response.status(401).json({ message: 'Token inválido' });
  }

  next();
};

app.get('/talker', async (request, response) => {
  const allTalkers = await fs.readFile('./talker.json', 'utf-8');
  const talkers = JSON.parse(allTalkers);
  response.status(200).send(talkers);
});

app.get('/talker/:id', async (request, response) => {
  const allTalkers = await fs.readFile('./talker.json', 'utf-8');
  const talkers = JSON.parse(allTalkers);
  const { id } = request.params;
  const talker = talkers.find((t) => t.id === +id);

  if (!talker) return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  response.status(200).json(talker);
});

// Uso da biblioteca Crypto para gerar a token foi disponibilizado no Slack: https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
app.post('/login', validarEmail, validarSenha, (request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  response.status(200).json({ token });
});

app.post('/talker', validarToken, validarNome, validarIdade, (_request, _response) => {
  console.log('teste');
});

app.listen(PORT, () => {
  console.log('Online');
});
