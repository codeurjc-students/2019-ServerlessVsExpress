import { connect } from 'react-redux';
import React, { Component } from 'react';
import { register, setErrorRegisterFalse } from '../actions/registerActions';
import { Link as LinkRouter, Redirect } from 'react-router-dom';

import SnackbarWrapper from '../components/SnackbarWrapper';

// Material-UI components
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            password2: "",
            firstName: "",
            lastName: "",
            passwordMissmatch: false,
            timerToLogin: null
        };
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handlePassword2Change = (event) => {
        if(event.target.value !== this.state.password) {
            this.setState({passwordMissmatch: true});
        } else {
            this.setState({passwordMissmatch: false});
        }
        this.setState({password2: event.target.value});
    }

    handleFirstNameChange = (event) => {
        this.setState({firstName: event.target.value});
    }

    handleLastNameChange = (event) => {
        this.setState({lastName: event.target.value});
    }

    doRegister = () => {
        let {email, password, password2, firstName, lastName} = this.state;

        this.props.register({email, password, password2, firstName, lastName});
    }

    render() {
        let {loading, errorRegister, errorMessage, setErrorRegisterFalse, registeredSuccessfully} = this.props;

        if(registeredSuccessfully) {
            return <Redirect to='/activation-message'/>;
        }

        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className='grid-login'
            >
                <CssBaseline/>
                <Container component='main' maxWidth='xs' className='login-container'>
                    <Avatar className='avatar'>
                        <PersonAddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" className='text-login-title'>
                        Register
                    </Typography>
                    <form className='form' noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            onChange={this.handleEmailChange}
                            autoFocus
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
                            onChange={this.handlePasswordChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password2"
                            label="Repeat password"
                            type="password"
                            id="password2"
                            autoComplete="current-password"
                            onChange={this.handlePassword2Change}
                            error={this.state.passwordMissmatch}
                            helperText={this.state.passwordMissmatch ? 'Passwords must be the same!' : ''}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="Firstname"
                            name="firstName"
                            autoComplete="firstname"
                            onChange={this.handleFirstNameChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Lastname"
                            name="lastName"
                            autoComplete="lastname"
                            onChange={this.handleLastNameChange}
                        />

                        <div className="wrapper-button-login">
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className='submit'
                                disabled={loading}
                                onClick={this.doRegister}
                            >
                                Register
                            </Button>
                            {loading && <CircularProgress size={24} className='buttonProgress' />}
                            <SnackbarWrapper
                                variant={errorRegister ? 'error' : 'success'}
                                className=''
                                message={errorRegister ? errorMessage : "Registered successfully!"}
                                show={errorRegister || registeredSuccessfully}
                                handleClose={setErrorRegisterFalse}
                            />
                        </div>
                        <Grid container>
                            <Grid item xs>

                            </Grid>
                            <Grid item>
                                <LinkRouter to={'/login'}>
                                    <span>
                                        {"I already have an account"}
                                    </span>
                                </LinkRouter>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Grid>
        );
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        loading: state.register.loading,
        errorRegister: state.register.errorRegister,
        errorMessage: state.register.errorMessage,
        registeredSuccessfully: state.register.registeredSuccessfully
    }
};

const mapDispatchToProps = {
    register,
    setErrorRegisterFalse
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)