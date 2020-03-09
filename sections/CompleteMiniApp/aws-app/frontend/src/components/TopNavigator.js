import { connect } from 'react-redux';
import React, { Component } from 'react';

import { logout } from '../actions/loginActions';

import Badge from '@material-ui/core/Badge';

class TopNavigator extends Component {

    handleLogout = () => {
        this.props.logout();
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