import { connect } from 'react-redux';
import React, { Component } from 'react';
import io from 'socket.io-client';

import { logout } from '../actions/loginActions';

import Badge from '@material-ui/core/Badge';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import Collapse from '@material-ui/core/Collapse';

const socket = io('http://localhost:4000');
class TopNavigator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            adminsConnected: [],
            adminsOpen: false
        };
    }

    componentDidMount() {
        socket.on('ADMINS_CONNECTED', data => {
            if(Object.entries(this.state.adminsConnected).toString() !== Object.entries(data).toString()) {
                this.setState({
                    adminsConnected: data,
                    adminsOpen: true
                });
            }
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    handleLogout = () => {
        this.props.logout();
    }

    handleCloseAdminsConnected = () => {
        this.setState({
            adminsOpen: false
        });
    };

    showAdminsConnected = () => {
        let adminsConnected = this.state.adminsConnected.map((admin, index) => <li key={index} className='connected-admin-email'>{admin.email}</li>);
        return  <Collapse in={this.state.adminsOpen} timeout='auto'>
                    <Alert icon={<DesktopMacIcon fontSize="inherit" />} severity='success' className="alert-admins" onClose={() => this.handleCloseAdminsConnected()}>
                        <AlertTitle>Admins connected:</AlertTitle>
                        <ul>
                        {adminsConnected}
                        </ul>
                    </Alert>
                </Collapse>;
    }

    render() {
        const { user } = this.props;

        return (
            <div className='header-section'>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/users">Users</a></li>
                </ul>
                <div className="user-section">
                    <Badge badgeContent={user.role} color="primary"></Badge> <span className="top-navigator-email">Hi, {user.email}!</span><button className="button-logout" onClick={this.handleLogout}>Logout</button>
                </div>
                {
                    this.showAdminsConnected()
                }
                
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
    logout
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigator);