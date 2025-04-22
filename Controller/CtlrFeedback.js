const express = require("express");
const jwt = require("jsonwebtoken"); 
const ctlrFeedback = express.Router();

const databese = require("../Database");

ctlrFeedback.post("/novo_feedBack", (req, res) => {
    let Dados = {
        Pergunta : 1 , //req.body.pergunta | O back irá retornar para o front qual user ta conectado, 
        //por isso deve ser passado pelo front
        Status : req.body.status, //tem que passar o padrão no front
        FeedBack : req.body.resposta
    }
    
    databese.insert(Dados).into("resposta").then(data => {
        res.status(201).json({mensagem : data});
    }).catch(err =>{
        res.status(500).json({mensagem : err});
    })
})

module.exports = ctlrFeedback;