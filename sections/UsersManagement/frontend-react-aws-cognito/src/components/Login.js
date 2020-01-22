import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link as LinkRouter, Redirect } from 'react-router-dom';
import { login, setErrorLoginFalse } from '../actions/loginActions';
import { setRedirectLogin, removeRegisteredUserInfo } from '../actions/registerActions';

import SnackbarWrapper from '../components/SnackbarWrapper';

// Material-UI components
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberUser: false
        };
    }

    componentDidMount () {
        this.props.setRedirectLogin(false);
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleRemember = (event) => {
        this.setState({rememberUser: event.target.checked});
    }

    doLogin = () => {
        let {email, password, rememberUser} = this.state;
        this.props.login(email, password, rememberUser);
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.userFromRegister) {
            const emailReg = nextProps.userFromRegister.email;
            const passwordReg = nextProps.userFromRegister.password;

            nextProps.removeRegisteredUserInfo();

            return ({
                email: emailReg,
                password: passwordReg
            });
        }
        return null;
    }

    render() {
        let {loading, errorLogin, setErrorLoginFalse, user} = this.props;
        const userLogged = user && user.email;

        if(userLogged) {
            return <Redirect to='/' />;
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" className='text-login-title'>
                        Sign in
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
                            value={this.state.email || ''}
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
                            value={this.state.password || ''}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" onChange={this.handleRemember} />}
                            label="Remember me"
                        />
                        <div className="wrapper-button-login">
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className='submit'
                                disabled={loading}
                                onClick={this.doLogin}
                            >
                                Sign In
                            </Button>
                            {loading && <CircularProgress size={24} className='buttonProgress' />}
                            <SnackbarWrapper
                                variant="error"
                                className=''
                                message="Wrong email and/or password!"
                                show={errorLogin}
                                handleClose={setErrorLoginFalse}

                            />
                        </div>
                        <Grid container>
                            <Grid item xs>

                            </Grid>
                            <Grid item>
                                <LinkRouter to={'/register'}>
                                    <span>
                                        {"Don't have an account? Sign Up"}
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
        loading: state.login.loading,
        user: state.login.user,
        errorLogin: state.login.errorLogin,
        userFromRegister: state.register.user,
        //isValidToken: state.login.isValidToken
    }
};

const mapDispatchToProps = {
    login,
    setErrorLoginFalse,
    setRedirectLogin,
    removeRegisteredUserInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)