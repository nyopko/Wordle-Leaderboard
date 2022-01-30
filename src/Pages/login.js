/// Components import
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
// import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Container, Row, Col } from 'react-grid';

import axios from 'axios';


class login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: [],
            loading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        axios
            .post('/login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                this.setState({
                    loading: false,
                });
                this.props.history.push('/');
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data,
                    loading: false
                });
            });
    };

    render() {
        // const { classes } = this.props;
        const { errors, loading } = this.state;
        return (
            <Container>
                <Row>
                    <Col md><h1>Column 1</h1></Col>
                    <Col md>
                    <TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className="submit-button"
							onClick={this.handleSubmit}
							disabled={loading || !this.state.email || !this.state.password}
						>
							Sign In
						</Button>
                    </Col>
                    <Col md><h1>Column 3</h1></Col>
                </Row>
            </Container>
        );
    }
}

export default login;