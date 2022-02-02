/// Components import
import React, { Component } from 'react';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';

import { Container, Row, Col } from 'react-grid';

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

    logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        this.props.history.push('/login');
    };

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/todos')
            .then((response) => {
                this.setState({
                    todos: response.data,
                    uiLoading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };


    render() {

        // Maths 

        console.log("todos", this.state.todos);

        // Total Score Maths

        let scoreArr = [];
        let totalScore;

        for (let entry of this.state.todos) {
            if (Number(entry.score) > 6) {
                scoreArr.push(7);
            }
            else {
                scoreArr.push(Number(entry.score));
            }
        }
        // console.log("scorearr", scoreArr);
        // const reducer = (previousValue, currentValue) => previousValue + currentValue;
        totalScore = scoreArr.reduce((partialSum, a) => partialSum + a, 0);


        // Number Correct Maths

        let passed = 0;
        let failed = 0;

        for (let entry of this.state.todos) {
            if (entry.score > 6) {
                failed++
            }
            else {
                passed++
            }
        }

        // Average Maths

        let average = totalScore / scoreArr.length;
        average = average.toFixed(1);
        console.log("average", average)

        console.log("failed", failed);
        console.log("passed", passed);

        console.log("total score", totalScore);
        console.log("todos", this.state.todos);
        console.log("createdAt", this.state.createAt)


        return (
            <div className='leaderboard-main-content'>
                <nav id="nav-bar">
                    <div class="nav-wrapper">
                        <a id="nav-title" href="/" class="brand-logo">Wordle Stats</a>
                        <ul id="nav-mobile" class="right hide-on-med-and-down">
                            <li><a href="/">Account and Scores</a></li>
                            <li><a onClick={this.logoutHandler}>Log Out</a></li>
                        </ul>
                    </div>
                </nav>


                {/* <div className="leaderboard-header">
                    <Container>
                        <Row>
                            <Col md>
                                <div className="home-button-group">
                                    <a class="waves-effect waves-light btn-large button-middle" href="/">Scores</a>
                                    <a class="waves-effect waves-light btn-large" href onClick={this.logoutHandler}>Log Out</a>
                                </div>
                            </Col>
                            <Col md>
                                <h1 className="name-header">Your Stats</h1>
                            </Col>
                        </Row>
                    </Container>
                </div> */}
                <Container>
                    <div className="leaderboard-description-box">
                        <Row>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>Total Number of Words Guessed:</h4>
                            </Col>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>{totalScore}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>Puzzled Completed:</h4>
                            </Col>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>{passed}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>Puzzles Failed:</h4>
                            </Col>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>{failed}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>Average Number of Guesses to Complete:</h4>
                            </Col>
                            <Col sm>
                                <h4 className='leaderboard-main-text'>{average}</h4>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        );
    }
}

export default App;