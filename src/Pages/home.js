/// Components import
import React, { Component } from 'react';
import axios from 'axios';

import Account from '../Components/account.js';
import Todo from '../Components/todo.js';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth'

import { Container, Row, Col } from 'react-grid';


const drawerWidth = 240;



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
                <Container>
                    <Row>
                        <Col md>
                            <div className="home-button-group">
                                <a class="waves-effect waves-light btn-large" onClick={this.loadAccountPage}>Account</a>
                                <a class="waves-effect waves-light btn-large button-middle" onClick={this.loadTodoPage}>Score</a>
                                <a class="waves-effect waves-light btn-large button-middle" href="/leaderboard">Leaderboard</a>
                                <a class="waves-effect waves-light btn-large" onClick={this.logoutHandler}>Log Out</a>
                            </div>
                        </Col>
                        <Col md>
                            <h1 className="name-header">{this.state.firstName}'s Scores</h1>
                        </Col>
                    </Row>
                </Container>
                <div className="main-content">{this.state.render ? <Account /> : <Todo />}</div>
            </div>
        )
    }
}

export default App;