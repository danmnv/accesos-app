// Config
require('./environment/config');

const functions = require('firebase-functions');
const jwt = require('jsonwebtoken');

exports.createToken = functions.https.onCall((data, context) => {
    let token = jwt.sign({ uid: context.auth.uid }, process.env.PRIVATE_KEY, { expiresIn: process.env.EXPIRATION });

    return { ok: true, jwt: token };
});
