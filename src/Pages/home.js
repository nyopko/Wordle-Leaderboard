/// Components import
import React, { Component } from 'react';
import axios from 'axios';

import Account from '../Components/account.js';
import Todo from '../Components/todo.js';

import { authMiddleWare } from '../util/auth'

import { Container, Row, Col } from 'react-grid';



class App extends Component {
    state = {
        render: false
    };

    loadAccountPage = (event) => {
        this.setState({ render: true });
    };

    loadTodoPage = (event) => {
        this.setState({ render: false });
    };

    logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        this.props.history.push('/login');
    };

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            profilePicture: '',
            uiLoading: true,
            imageLoading: false
        };
    }

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
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
        return (
            <div className="home-header">

                <nav id="nav-bar">
                    <div class="nav-wrapper">
                        <a href="/" class="brand-logo">Wordle Stats</a>
                        <ul id="nav-mobile" class="right hide-on-med-and-down">
                            <li><a onClick={this.loadAccountPage}>Account</a></li>
                            <li><a onClick={this.loadTodoPage}>Score</a></li>
                            <li><a href="/leaderboard">Leaderboard</a></li>
                            <li><a onClick={this.logoutHandler}>Log Out</a></li>
                        </ul>
                    </div>
                </nav>


                {/* <Container>
                    <Row>
                        <Col md>
                            <div className="home-button-group">
                                <a class="waves-effect waves-light btn" onClick={this.loadAccountPage}>Account</a>
                                <a class="waves-effect waves-light btn button-middle" onClick={this.loadTodoPage}>Score</a>
                                <a class="waves-effect waves-light btn button-middle" href="/leaderboard">Leaderboard</a>
                                <a class="waves-effect waves-light btn" onClick={this.logoutHandler}>Log Out</a>
                            </div>
                        </Col>
                        <Col md>
                            <h1 className="name-header">{this.state.firstName}'s Scores</h1>
                        </Col>
                    </Row>
                </Container> */}
                <div className="main-content">{this.state.render ? <Account /> : <Todo />}</div>
            </div>
        )
    }
}

export default App;