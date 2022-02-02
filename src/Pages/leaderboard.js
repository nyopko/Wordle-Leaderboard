/// Components import
import React, { Component } from 'react';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: '',
            score: '',
            createAt: '',
            body: '',
            todoId: '',
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/todos')
            .then((response) => {
                this.setState({
                    scores: response.data,
                    firstName: response.data.userCredentials.firstName,
                    uiLoading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
            axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    phoneNumber: response.data.userCredentials.phoneNumber,
                    country: response.data.userCredentials.country,
                    username: response.data.userCredentials.username,
                    uiLoading: false,
                });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.history.push('/login')
                }
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    };

    
    render() {
        console.log("todos", this.state.todos);

        let scoreArr = [];
        let totalScore;

        for (let entry of this.state.todos) {
            scoreArr.push(Number(entry.score));
        }
        // console.log("scorearr", scoreArr);
        // const reducer = (previousValue, currentValue) => previousValue + currentValue;
        totalScore = scoreArr.reduce((partialSum, a) => partialSum + a, 0);

        console.log("total score", totalScore);
        console.log("todos", this.state.todos);
        console.log("createdAt", this.state.createAt)


        return (
            <div>
            <h1>{this.state.firstName}</h1>
            </div>
        );
    }
}

export default App;