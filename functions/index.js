const functions = require('firebase-functions');
const app = require('express')();

const auth = require('./util/auth');

// const cors = require('cors');
// app.use(cors());
// app.options('*', cors())

const {
    getAllScores,
    // getOneScore,
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
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);
// app.post('/users/image', auth, uploadProfilePhoto);


// Scores 

app.get('/todos', auth, getAllScores);
// app.get('/todo/:todoId', auth, getOneTodo);
app.post('/todo', auth, postOneScore);
app.delete('/todo/:todoId', auth, deleteScore);
app.put('/todo/:todoId', auth, editScore);

exports.api = functions.https.onRequest(app);