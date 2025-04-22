require('dotenv').config();

const express = require('express');
const cors = require("cors");
const databese = require("./Database")

const app = express();

// Middleware para parsing de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require("./router");

// Configuração do CORS
app.use(cors());

// Servindo arquivos estáticos
app.use(express.static('Public'));

// Usando o router
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
