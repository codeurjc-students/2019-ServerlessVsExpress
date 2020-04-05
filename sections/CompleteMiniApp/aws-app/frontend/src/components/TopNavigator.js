import { connect } from 'react-redux';
import React, { Component } from 'react';

import { logout } from '../actions/loginActions';

import Badge from '@material-ui/core/Badge';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import Collapse from '@material-ui/core/Collapse';

import * as Config from '../config/config';

class TopNavigator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            adminsConnected: [],
            adminsOpen: false
        };
    }

    componentDidMount() {
        let socket = new WebSocket(Config.URL_WEBSOCKETS_API, []);
        
        if(this.props.user.role.toLowerCase() === "admin") {
            const message = {
                action: "onMessage",
                data: {
                    email_admin: this.props.user.email
                }
            };

            socket.onopen = () => socket.send(JSON.stringify(message));
        }
        
        socket.onmessage = (evt) => {
            const message = JSON.parse(evt.data);
            // Don't show yourself if you are an admin
            if(this.props.user.email !== message.email_admin) {
                this.setState({
                    adminsConnected: [message.email_admin],
                    adminsOpen: true
                });
            }
        };
    }

    componentWillUnmount() {
        //socket.close();
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
        let adminsConnected = this.state.adminsConnected.map((admin, index) => <li key={index} className='connected-admin-email'>{admin}</li>);
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