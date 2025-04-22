const express = require("express");
const jwt = require("jsonwebtoken");
const CtlrPublic = express.Router();
const { authenticateToken, JWTSecret } = require("../authMiddleware");

const databese = require("../Database")

CtlrPublic.post('/novo_user', (req, res) => {

  const { nome, email, senha } = req.body;

  if (!nome || !senha || !email) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  // Verificar se já existe um usuário com esse email
  databese('usuario').where({ Email: email }).then(data => {
    if (data.length > 0) {
      return res.status(409).json({ mensagem: "Email já está em uso." });
    } else {
      let dados = {
        Nome: nome,
        Senha: senha,
        Email: email
      }

      databese.insert(dados).into("usuario").then(data => {
        res.status(201).json({ mensagem: data });
      }).catch(err => {
        res.status(500).json({ mensagem: err });
      })

    }
  })
})

CtlrPublic.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  databese
  .select("*")
  .from("usuario")
  .where({ Email: email, Senha: senha })
  .then(data => {
    if (data.length > 0) {
      const usuario = data[0];

      const token = jwt.sign(
        {
          id: usuario.ID,
          nome: usuario.Nome,
          email: usuario.Email
        },
        JWTSecret,
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } else {
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro no servidor" });
  });
});


module.exports = CtlrPublic