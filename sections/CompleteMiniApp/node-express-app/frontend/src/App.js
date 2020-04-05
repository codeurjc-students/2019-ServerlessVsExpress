import React, {Component} from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import './styles/App.scss';
import { BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import ActivationMessage from './components/ActivationMessage';
import UsersSection from './components/UsersSection';
import TopNavigator from './components/TopNavigator';

import {
    checkValidToken
} from './actions/loginActions';

const PrivateRoute = ({ ...props }) => {
    if(props.isUserLogged) {
        return <Route { ...props } />;
    } else {
        return <Redirect to="/login" />;
    }
};

const cookies = new Cookies();

class App extends Component {
    componentDidMount() {
        if(cookies.get('access_token')) {
            this.props.checkValidToken();
        }
    }

    render() {
        let { user } = this.props;
        const userLogged = user && user.email;

        return (
            <div className="App">
                {userLogged ? <TopNavigator/> : []}
                <Router>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/activation-message" component={ActivationMessage} />
                        <PrivateRoute exact path="/" component={Main} isUserLogged={userLogged} />
                        <PrivateRoute exact path="/users" component={UsersSection} isUserLogged={userLogged} />
                    </Switch>
                </Router>
            </div>
        );
    }

}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        user: state.login.user
    }
};

const mapDispatchToProps = {
    checkValidToken
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
