const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

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

app.listen(PORT, () => {
  console.log('Online');
});
