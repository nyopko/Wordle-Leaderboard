const functions = require('firebase-functions');
const app = require('express')();

const auth = require('./util/auth');

const {
    getAllScores,
    getOneScore,
    postOneScore,
    deleteScore,
    editScore
} = require('./APIs/todos')

const {
    loginUser,
    signUpUser,
    // uploadProfilePhoto,
    getUserDetail,
    updateUserDetails,
} = require('./APIs/users');

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
// app.post('/users/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);


// Scores 

app.get('/todos', getAllScores);

app.post('/todo', postOneScore);
app.delete('/todo/:todoId', deleteScore);
app.put('/todo/:todoId', editScore);
exports.api = functions.https.onRequest(app);