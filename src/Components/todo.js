import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

import { Container, Row, Col } from 'react-grid';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
})
);

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

class todo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: '',
            score: '',
            createAt: '',
            body: '',
            todoId: '',
            errors: [],
            open: false,
            uiLoading: true,
            buttonType: '',
            viewOpen: false
        };

        this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
        this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
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
                    todos: response.data,
                    uiLoading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deleteTodoHandler(data) {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let todoId = data.todo.todoId;
        axios
            .delete(`todo/${todoId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleEditClickOpen(data) {
        this.setState({
            score: data.todo.score,
            createAt: data.todo.createAt,
            body: data.todo.body,
            todoId: data.todo.todoId,
            buttonType: 'Edit',
            open: true
        });
    }

    handleViewOpen(data) {
        this.setState({
            score: data.todo.score,
            createAt: data.todo.createAt,
            body: data.todo.body,
            viewOpen: true
        });
    }

    render() {
        // const DialogTitle = withStyles(styles)((props) => {
        //     const { children, classes, onClose, ...other } = props;
        //     // return (
        //     //     <MuiDialogTitle disableTypography className={classes.root} {...other}>
        //     //         <Typography variant="h6">{children}</Typography>
        //     //         {onClose ? (
        //     //             <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        //     //                 <CloseIcon />
        //     //             </IconButton>
        //     //         ) : null}
        //     //     </MuiDialogTitle>
        //     // );
        // });

        // const DialogContent = withStyles((theme) => ({
        //     viewRoot: {
        //         padding: theme.spacing(2)
        //     }
        // }))(MuiDialogContent);

        dayjs.extend(relativeTime);
        const { classes } = this.props;
        const { open, errors, viewOpen } = this.state;

        const handleClickOpen = () => {
            this.setState({
                todoId: '',
                score: '',
                body: '',
                buttonType: '',
                open: true
            });
        };

        const handleSubmit = (event) => {
            authMiddleWare(this.props.history);
            event.preventDefault();

            const userTodo = {
                score: this.state.score,
                createAt: this.state.createAt,
                body: this.state.body
            };
            console.log(userTodo);
            let options = {};
            if (this.state.buttonType === 'Edit') {
                options = {
                    url: `/todo/${this.state.todoId}`,
                    method: 'put',
                    data: userTodo
                };
            } else {
                options = {
                    url: '/todo',
                    method: 'post',
                    data: userTodo
                };
            }
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = { Authorization: `${authToken}` };
            axios(options)
                .then(() => {
                    this.setState({ open: false });
                    window.location.reload();
                })
                .catch((error) => {
                    this.setState({ open: true, errors: error.response.data });
                    console.log(error);
                });
        };

        const handleViewClose = () => {
            this.setState({ viewOpen: false });
        };

        const handleClose = (event) => {
            this.setState({ open: false });
        };

        // console.log("todos", this.state.todos);

        // Loading Spinner
        if (this.state.uiLoading === true) {
            return (
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </main>
            );
        } else {
            return (
                <div>
                    <div className="score-log">
                        <h3>Score Log</h3>
                        <Container>
                            <Row>
                                <Col md><Grid container spacing={2}>
                                    {this.state.todos.map((todo) => (
                                        <Grid item xs={12} sm={6}>
                                            <Card className={classes.root} variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h5" component="h2">
                                                        { //Calculate Fail or Not
                                                            (Number(todo.score) < 7)
                                                                ? <div>Score: {todo.score}</div>
                                                                : <div>Puzzle Failed</div>
                                                        }
                                                    </Typography>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        {dayjs(todo.createdAt).fromNow()}
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        {`${todo.body.substring(0, 65)}`}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                        Details
                                                    </Button>
                                                    <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                        Edit
                                                    </Button>
                                                    <Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid></Col>
                            </Row>
                        </Container>
                    </div>

                    {/* Button Here */}
                    <div className="add-button">
                    <IconButton
                        color="primary"
                        aria-label="Add Score"
                        onClick={handleClickOpen}
                    >
                        <AddCircleIcon style={{ fontSize: 60 }} />
                    </IconButton>
                    </div>
                    {/* End Button */}
                    <main className={classes.content}>
                        <div className={classes.toolbar} />

                        <Dialog fullScreen open={open} onClose={handleClose}>
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6" className={classes.title}>
                                        {this.state.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
                                    </Typography>
                                    <Button
                                        autoFocus
                                        color="inherit"
                                        onClick={handleSubmit}
                                        className={classes.submitButton}
                                    >
                                        {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                                    </Button>
                                </Toolbar>
                            </AppBar>


                            {/* Edit Score Form */}

                            <form className={classes.form} noValidate>
                                <Container>
                                    <Row>
                                        <Col sm>
                                            <div className="edit-box">
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="score-details"
                                                    label="Score Details"
                                                    name="score"
                                                    autoComplete="score-details"
                                                    multiline
                                                    minRows={25}
                                                    maxRows={25}
                                                    helperText={errors.body}
                                                    error={errors.body ? true : false}
                                                    onChange={this.handleChange}
                                                    value={this.state.score}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm>
                                            <div className="edit-box">
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="body-details"
                                                    label="body"
                                                    name="body"
                                                    autoComplete="body-details"
                                                    multiline
                                                    minRows={25}
                                                    maxRows={25}
                                                    helperText={errors.body}
                                                    error={errors.body ? true : false}
                                                    onChange={this.handleChange}
                                                    value={this.state.body}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </form>
                        </Dialog>

                        {/* <Grid container spacing={2}>
						{this.state.todos.map((todo) => (
							<Grid item xs={12} sm={6}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{todo.score}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{dayjs(todo.createdAt).fromNow()}
										</Typography>
										<Typography variant="body2" component="p">
											{`${todo.body.substring(0, 65)}`}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
											{' '}
											View{' '}
										</Button>
										<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
											Edit
										</Button>
										<Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid> */}

                        {/* View Score Pop-Out */}

                        <Dialog
                            onClose={handleViewClose}
                            aria-labelledby="customized-dialog-title"
                            open={viewOpen}
                            fullWidth
                        >
                            <div className="popout">
                                <Container>
                                    <Row>
                                        <Col md>
                                            <div className="body-popout">
                                                <h6><b>Board</b></h6>
                                                <TextField
                                                    id="board"
                                                    name="body"
                                                    multiline
                                                    readonly
                                                    minRows={1}
                                                    maxRows={25}
                                                    value={this.state.body}
                                                    InputProps={{
                                                        disableUnderline: true
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md>
                                            <div className="score-popout">
                                                <h6><b>Score</b></h6>
                                                <TextField
                                                    id="scores"
                                                    name="Score"
                                                    multiline
                                                    readonly
                                                    minRows={1}
                                                    maxRows={25}
                                                    value={this.state.score}
                                                    InputProps={{
                                                        disableUnderline: true
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Dialog>
                    </main>
                </div>
            );
        }
    }
}

export default (withStyles(styles)(todo));