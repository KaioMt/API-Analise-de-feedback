const express = require("express");
const jwt = require("jsonwebtoken"); 
const ctlrPergunta = express.Router();

const databese = require("../Database")

ctlrPergunta.post("/novo_quest", (req, res) => {
    let Dados = {
        Pergunta : req.body.pergunta,
        Email_desti : req.body.email,
        Status : req.body.status, //tem que passar o padrão no front
        Usuário: 3 //req.body.usuario | O back irá retornar para o front qual user ta conectado, 
        //por isso deve ser passado pelo front
    }
    
    databese.insert(Dados).into("questionario").then(data => {
        res.status(201).json({mensagem : data});
    }).catch(err =>{
        res.status(500).json({mensagem : err});
    })
})

module.exports = ctlrPergunta;