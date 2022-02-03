import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';

class account extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			username: '',
			uiLoading: true,
			buttonLoading: false,
			imageError: ''
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
					username: response.data.userCredentials.username,
					uiLoading: false
				});
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleImageChange = (event) => {
		this.setState({
			image: event.target.files[0]
		});
	};

	profilePictureHandler = (event) => {
		event.preventDefault();
		this.setState({
			uiLoading: true
		});
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		let form_data = new FormData();
		form_data.append('image', this.state.image);
		form_data.append('content', this.state.content);
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.post('/user/image', form_data, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({
					uiLoading: false,
					imageError: 'Error in posting the data'
				});
			});
	};

	updateFormValues = (event) => {
		event.preventDefault();
		this.setState({ buttonLoading: true });
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		const formRequest = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
		};
		axios
			.post('/user', formRequest)
			.then(() => {
				this.setState({ buttonLoading: false });
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({
					buttonLoading: false
				});
			});
	};

	render() {
		return(
            <div className='account-main-content'>
            <h1>{this.state.firstName}</h1>
            <form autoComplete="off" noValidate>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="First name"
											margin="dense"
											name="firstName"
											variant="outlined"
											value={this.state.firstName}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Last name"
											margin="dense"
											name="lastName"
											variant="outlined"
											value={this.state.lastName}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Email"
											margin="dense"
											name="email"
											variant="outlined"
											disabled={true}
											value={this.state.email}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="User Name"
											margin="dense"
											name="userHandle"
											disabled={true}
											variant="outlined"
											value={this.state.username}
											onChange={this.handleChange}
										/>
									</Grid>
								</Grid>
							</CardContent>
							<Divider />
							<CardActions />
						</form>
                        <Button
						color="primary"
						variant="contained"
						type="submit"
						className="submit-button"
						onClick={this.updateFormValues}
						disabled={
							this.state.buttonLoading ||
							!this.state.firstName ||
							!this.state.lastName
						}
					>
						Save details
						{this.state.buttonLoading && <CircularProgress size={30} className="button" />}
					</Button>
            </div>
        )
	}
}

export default account;