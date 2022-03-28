const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const {
  validarEmail,
  validarSenha,
} = require('./middlewares/index.js')

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Por algum motivo, a importação das validações de email e senha não estão funcionando, portanto inseri no arquivo principal
// const validarEmail = (request, response, next) => {
//   const { email } = request.body;
//   const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

//   if (!email || email === '') {
//     return response.status(400).json({ message: 'O campo "email" é obrigatório' });
//   }

//   if (email.match(mailformat)) {
//     next();
//   } else {
//     return response.status(400)
//     .json({ message: 'O "email" deve ter o formato "email@email.com"' });
//   }
//   next();
// };

// const validarSenha = (request, response, next) => {
//   const { password } = request.body;

//   if (!password) {
//     return response.status(400).json({ message: 'O campo "password" é obrigatório' });
//   }

//   if (password.length < 6) {
//     return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
//   }

//   next();
// };

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

function validarNome(request, response, next) {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({ message: 'O campo "name" é obigatório' });
  }

  if (name.length < 3) {
    return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
}

function validarIdade(request, response, next) {
  const { age } = request.body;
  if (!age) {
    return response.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age < 18) {
    return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
}

app.post('/talker', validarToken, validarNome, validarIdade, (request, response) => {

});

app.listen(PORT, () => {
  console.log('Online');
});
