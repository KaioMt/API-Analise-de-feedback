require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken"); 
const ctlrUsuario = express.Router();
const axios = require('axios');

const databese = require("../Database");

function interpretarEstrelas(label) {
  switch (label) {
    case '1 star':
      return 'Muito negativo';
    case '2 stars':
      return 'Negativo';
    case '3 stars':
      return 'Neutro';
    case '4 stars':
      return 'Positivo';
    case '5 stars':
      return 'Muito positivo';
    default:
      return 'Desconhecido';
  }
}

ctlrUsuario.post('/sentimento', async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ erro: 'Campo "texto" é obrigatório.' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
      { inputs: texto },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const resultado = response.data[0]; // Lista de sentimentos
    const maisProvavel = resultado.reduce((a, b) => (a.score > b.score ? a : b));
    console.log(maisProvavel.label);//pega o sentimento por estrela(5 muito bom, 4 bom, 3 neutro, 2 ruim, 1 muito ruim)

    res.json({
      texto,
      sentimento: interpretarEstrelas(maisProvavel.label),
      confianca: `${(maisProvavel.score * 100).toFixed(2)}%`,
      detalhes: resultado.map(r => ({
        sentimento: interpretarEstrelas(r.label),
        confianca: `${(r.score * 100).toFixed(2)}%`
      }))
    });
  } catch (error) {
    console.error('Erro na API da Hugging Face:', error.response?.data || error.message);
    res.status(500).json({
      erro: 'Erro ao processar análise de sentimento.',
      detalhes: error.response?.data || error.message,
    });
  }
});

ctlrUsuario.get('/home', (req, res) =>{
  databese.select("*").table("questionario")
  .then(data => {
    res.status(201).json({Perguntas : data});
  })
  .catch(err => {
    res.status(500).json({mensagem :err});
  })
})




ctlrUsuario.get('/teste', (req, res) => {
  res.status(200).json({mensagem : "Deu certo Porra"})
})


  module.exports = ctlrUsuario