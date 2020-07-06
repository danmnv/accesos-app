// Config
require('./environment/config');

const functions = require('firebase-functions');
const jwt = require('jsonwebtoken');

exports.createToken = functions.https.onCall((data, context) => {
    let token = jwt.sign({ uid: context.auth.uid }, process.env.PRIVATE_KEY, { expiresIn: process.env.EXPIRATION });

    return { ok: true, jwt: token };
});

exports.validateToken = functions.https.onCall((data, context) => {
    try {
        // Obtención de token por encabezado Bearer.
        let token = data.token;
        // Decodificar token
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY, { ignoreExpiration: false });

        // Permitir acceso
        if (decoded) {
            return { ok: true, msg: "Token válido" };
        }
    }
    catch(error) {
        // Token inválido
        return { ok: false, unauth: true, msg: "Token caducado", err: error };
    }
});