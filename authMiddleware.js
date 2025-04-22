// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//     if (!req.cookies.token) {
//         // return res.status(403).json({ mensagem: 'Token não fornecido' });
//         res.redirect("/usuario/login")
//     }

//     const JWTScret = "123456789";

//     jwt.verify(req.cookies.token, JWTScret, (err, user) => {
//         if (err) {
//             return res.status(403).json({ mensagem: 'Token inválido' });
//         } else {
//             req.Token = req.cookies.token;
//             req.loggedUser = { id: user.id, nome: user.nome, email: user.email, empresa: user.empresa, };
//             next();
//         }
//     });
// }

// module.exports = authenticateToken;

require('dotenv').config();
const jwt = require("jsonwebtoken");

const JWTSecret = process.env.Scret;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Irá vir do Front. Segue um exemplo: 
//  fetch('http://localhost:3000/minha-rota-protegida', {
//   method: 'GET',
//   headers: {
//     'Authorization': 'Bearer SEU_TOKEN_JWT'
//   }
// });
    const token = authHeader && authHeader.split(' ')[1]; // Pega só o token

    if (!token) {
        return res.status(403).json({ mensagem: 'Token não fornecido' });
        //Ou passar a rota de logout
    }

    jwt.verify(token, JWTSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido' });
        } else {
            req.Token = token;
            req.loggedUser = {
                id: user.id,
                nome: user.nome,
                email: user.email,
                empresa: user.empresa,
            };
            next();
        }
    });
}

module.exports = {
    authenticateToken,
    JWTSecret
};
