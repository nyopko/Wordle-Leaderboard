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
                        <h3 className='score-log-header'>Score Log</h3>
                        <Container>
                            <Row>
                                <Col md><Grid container spacing={2}>
                                    {this.state.todos.map((todo) => (
                                        <Grid item xs={12} sm={6}>
                                            <Card className="score-cards" variant="outlined">
                                                <CardContent>
                                                    <Container>
                                                        <Row>
                                                            <Col>
                                                                <h5 className='score-text'>
                                                                    { //Calculate Fail or Not
                                                                        (Number(todo.score) < 7)
                                                                            ? <div>Score: {todo.score}</div>
                                                                            : <div>Puzzle Failed</div>
                                                                    }
                                                                </h5>
                                                            </Col>
                                                            <Col>
                                                                <h5 className='score-text'>
                                                                    <b>Word: </b> {todo.body}
                                                                </h5>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                    <h6 className="secondary-text">
                                                        Created {dayjs(todo.createdAt).fromNow()}</h6>
                                                    </Row>
                                                    </Container>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" class="button-links" onClick={() => this.handleViewOpen({ todo })}>
                                                        Details
                                                    </Button>
                                                    <Button size="small" class="button-links" onClick={() => this.handleEditClickOpen({ todo })}>
                                                        Edit
                                                    </Button>
                                                    <Button size="small" class="button-links" onClick={() => this.deleteTodoHandler({ todo })}>
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
                            <AppBar className="app-bar">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <h6 className="app-bar-title">
                                        {this.state.buttonType === 'Edit' ? 'Edit Game' : 'Enter New Game Details'}
                                    </h6>
                                </Toolbar>
                            </AppBar>


                            {/* Edit Score Form */}
                            <div className='edit-score-popout'>
                            <div className="score-forms">                              
                            <form noValidate>
                                <Container>
                                    <Row>
                                        <Col sm>
                                            <div className="edit-box">
                                            <p className='form-label'>Score</p>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    id="score-details-edit"
                                                    name="score"
                                                    autoComplete="score-details"
                                                    helperText={errors.body}
                                                    error={errors.body ? true : false}
                                                    onChange={this.handleChange}
                                                    value={this.state.score}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm>
                                            <div className="edit-box">
                                            <p className='form-label'>Word</p>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    id="body-details-edit"
                                                    name="body"
                                                    autoComplete="body-details"
                                                    helperText={errors.body}
                                                    error={errors.body ? true : false}
                                                    onChange={this.handleChange}
                                                    value={this.state.body}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                                <Button
                                        autoFocus
                                        color="inherit"
                                        onClick={handleSubmit}
                                        className="add-score-button"
                                    >
                                        {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                                    </Button>
                            </form>
                            </div>
                            </div> 
                        </Dialog>

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
                                                <h6><b>Word</b></h6>
                                                <TextField
                                                    id="board"
                                                    name="body"
                                                    multiline
                                                    readonly
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