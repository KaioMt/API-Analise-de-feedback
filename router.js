const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./authMiddleware");

const User = require("./Controller/CtlrUsuario")
const Quest = require("./Controller/CtlrPergunta")
const Resp = require("./Controller/CtlrFeedback")
const CtlrPublic = require("./Controller/CtlrPublic");
  
// Login não precisa de autenticação
router.use("/publica", CtlrPublic);

// Rotas protegidas
router.use("/pergunta", authenticateToken, Quest);      // Exemplo: /quest/...
router.use("/user", authenticateToken, User);       // Exemplo: /user/criar
router.use("/feedback", authenticateToken, Resp);

module.exports = router