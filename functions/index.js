const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllScores,
    getOneScore,
    postOneScore,
    deleteScore,
    editScore
} = require('./APIs/todos')

app.get('/todos', getAllScores);

app.post('/todo', postOneScore);

exports.api = functions.https.onRequest(app);